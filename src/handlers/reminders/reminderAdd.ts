import { MessageType, proto, WAMessage } from '@adiwajshing/baileys';
import { Job, JobAttributesData } from 'agenda';
import { agendaConstDefinition } from '../../constants/agenda';
import { ReminderScheduleData, ResolverFunctionCarry, ResolverResult } from '../../types/type';
import agenda from '../../worker';
import humanInterval from 'human-interval';

const sendBlockedRepeatInterval = (message: WAMessage): ResolverResult => {
  return {
    destinationId: message.key.remoteJid,
    message: 'Maaf ya, gak bisa seconds ataupun minutes, ni server overload lu mau ganti hah ?',
    type: MessageType.text,
    options: {
      quoted: message,
    },
  };
};

export const reminderAdd: ResolverFunctionCarry =
  (matches: RegExpMatchArray) =>
  (message: proto.WebMessageInfo): ResolverResult => {
    try {
      const cleanRepeatAt = matches[1].replace(/_/g, ' ');
      const cleanMsg = matches[2].replace(/_/g, ' ');

      if (cleanRepeatAt.match(/second?s|minute?s/)) {
        return sendBlockedRepeatInterval(message);
      }

      const schedule: ReminderScheduleData = {
        jid: message.key.remoteJid,
        msg: cleanMsg,
      };

      const job: Job<JobAttributesData> = agenda.create(agendaConstDefinition.send_reminder, schedule);
      job.schedule(cleanRepeatAt);
      job.repeatAt(cleanRepeatAt);
      job.save();
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

    const msg = `Reminder created`;
    return {
      destinationId: message.key.remoteJid,
      message: msg,
      type: MessageType.extendedText,
      options: {
        quoted: message,
        contextInfo: {
          quotedMessage: message.message,
        },
      },
    };
  };
