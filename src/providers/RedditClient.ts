import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { URLSearchParams } from 'url';

const TOKEN_BASE_URL = 'https://www.reddit.com/api/v1/access_token';
const REQUEST_TIMEOUT = 2 * 60 * 1000;

export class RedditClient {
  username: string;
  password: string;
  appId: string;
  appSecret: string;
  userAgent: string;
  token: string;
  tokenExpireDate: number;

  constructor(opts: { userAgent?: string } = null) {
    this.username = process.env.REDDIT_USERNAME;
    this.password = process.env.REDDIT_PASSWORD;
    this.appId = process.env.REDDIT_APP_ID;
    this.appSecret = process.env.REDDIT_APP_SECRET;
    this.userAgent = opts?.userAgent || `nodejs:${this.appId}:v1 (by /u/kbiits)`;

    this.token = null;
    this.tokenExpireDate = 0;
  }

  async sendRequest(url: string, config: AxiosRequestConfig = {}): Promise<AxiosResponse> {
    const token = await this._getToken();
    return axios.request({
      url: url,
      headers: {
        authorization: token,
        'User-Agent': this.userAgent,
      },
      timeout: REQUEST_TIMEOUT,
      ...config,
    });
  }

  async _getToken(): Promise<string> {
    if (Date.now() / 1000 <= this.tokenExpireDate) {
      return this.token;
    }

    return new Promise((resolve, reject) => {
      const formData = new URLSearchParams();
      formData.append('grant_type', 'password');
      formData.append('username', this.username);
      formData.append('password', this.password);
      axios
        .post(TOKEN_BASE_URL, formData, {
          headers: {
            authorization: `Basic ${Buffer.from(`${this.appId}:${this.appSecret}`).toString('base64')}`,
            'User-Agent': this.userAgent,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          timeout: REQUEST_TIMEOUT,
        })
        .then((res) => {
          const statusType = Math.floor(res.status / 100);
          if (statusType === 2) {
            const { access_token: accessToken, expires_in: expiresIn, token_type: tokenType } = res.data;

            if (tokenType == null || accessToken == null) {
              return reject(
                new Error(
                  `Cannot obtain token for username ${this.username}. ${res.data.error}. ${res.data.error_description}.`
                )
              );
            }

            this.token = `${tokenType} ${accessToken}`;
            // Shorten token expiration time by half to avoid race condition where
            // token is valid at request time, but server will reject it
            this.tokenExpireDate = (Date.now() / 1000 + expiresIn) / 2;

            return resolve(this.token);
          } else if (statusType === 4) {
            return reject(
              new Error(
                `Cannot obtain token for username ${this.username}. Did you give ${this.username} access in your Reddit App Preferences? ${res.data.error}. ${res.data.error_description}. Status code: ${res.status}`
              )
            );
          } else {
            return reject(
              new Error(
                `Cannot obtain token for username ${this.username}. ${res.data.error}. ${res.data.error_description}. Status code: ${res.status}`
              )
            );
          }
        })
        .catch((err) => {
          err.message = `Error getting token: ${err.message}`;
          return reject(err);
        });
    });
  }
}
