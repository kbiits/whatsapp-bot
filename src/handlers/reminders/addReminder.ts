import { MessageType, proto, WAMessage } from '@adiwajshing/baileys';
import { Job, JobAttributesData } from 'agenda';
import dateJs from 'date.js/dist/date';
import { agendaConstDefinition } from '../../constants/agenda';
import { ReminderScheduleData, ResolverFunctionCarry, ResolverResult } from '../../types/type';
import worker from '../../worker';

const sendBlockedRepeatInterval = (message: WAMessage, jid: string): ResolverResult => {
  return {
    destinationId: jid,
    message: 'Maaf ya, gak bisa seconds ataupun minutes, ni server overload lu mau ganti hah ?',
    type: MessageType.text,
    options: {
      quoted: message,
    },
  };
};

export const addReminderInterval: ResolverFunctionCarry =
  (matches: RegExpMatchArray) =>
  (message: proto.WebMessageInfo, jid: string): ResolverResult => {
    const mentionedJids = message.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    try {
      const cleanRepeatAt = matches[1].replace(/repeat/g, ' ').trim();
      const cleanMsg = matches[2];

      if (cleanRepeatAt.match(/seconds?|minutes?/)) {
        return sendBlockedRepeatInterval(message, jid);
      }

      const scheduleData: ReminderScheduleData = {
        jid,
        msg: cleanMsg,
      };
      mentionedJids && (scheduleData.mentionedJids = mentionedJids);

      const numberNow = Date.now();
      const date: Date = dateJs(cleanRepeatAt.replace(/ +interval.+/, '').toLowerCase(), numberNow);

      if (numberNow === date.getTime()) {
        return {
          destinationId: jid,
          message: 'Invalid date format',
          type: MessageType.text,
          options: {
            quoted: message,
          },
        };
      }

      if (matches[1].indexOf('repeat') === -1) {
        worker.schedule(date, agendaConstDefinition.send_reminder, scheduleData);
      } else {
        let regexRes = cleanRepeatAt.match(/ +interval +(.+)/);
        if (!regexRes) {
          return {
            destinationId: jid,
            message: 'Please specify interval for repeated reminder',
            type: MessageType.text,
            options: {
              quoted: message,
            },
          };
        }

        const job: Job<JobAttributesData> = worker.create(agendaConstDefinition.send_reminder, scheduleData);
        job.schedule(date);
        job.repeatEvery(regexRes[1], {
          timezone: 'Asia/Jakarta',
          skipImmediate: true,
          computeNextRunAtImmediately: false,
        });
        job.save();
      }
    } catch (err) {
      console.log('error');
      console.log(err);
      return {
        destinationId: message.key.remoteJid,
        message: 'Gagal membuat reminder, Periksa kembali format tanggal',
        type: MessageType.extendedText,
        options: {
          quoted: message,
          contextInfo: {
            quotedMessage: message.message,
          },
        },
      };
    }

    return {
      destinationId: message.key.remoteJid,
      message: 'Reminder created',
      type: MessageType.extendedText,
      options: {
        quoted: message,
        contextInfo: {
          quotedMessage: message.message,
        },
      },
    };
  };
