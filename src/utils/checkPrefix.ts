import PrefixModel from "../models/Prefix";


export default async (userPrefixInput: String, jid: string): Promise<String | Boolean> => {
  const defaultPrefix = `/${process.env.DEFAULT_PREFIX}`;
  if (userPrefixInput.charAt(0) !== '/') {
    return false;
  }

  const prefix = await PrefixModel.findOne({
    jid,
  }).exec();

  if (!prefix) {
    return userPrefixInput === defaultPrefix ? defaultPrefix : false;
  }
  return prefix.prefix === userPrefixInput.substring(1) ? `/${prefix.prefix}` : false;
};
