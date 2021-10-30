import { MessageType, proto, WAMessage } from '@adiwajshing/baileys';
import { Job, JobAttributesData } from 'agenda';
import agenda from '../../agendas';
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

export const addReminder: ResolverFunctionCarry =
  (matches: RegExpMatchArray) =>
  (message: proto.WebMessageInfo, jid: string): ResolverResult => {
    try {
      const cleanRepeatAt = matches[1].replace(/_/g, ' ');
      const cleanMsg = matches[2].replace(/_/g, ' ');

      if (cleanRepeatAt.match(/second?s|minute?s/)) {
        return sendBlockedRepeatInterval(message, jid);
      }

      const schedule: ReminderScheduleData = {
        jid,
        msg: cleanMsg,
      };
      if (cleanRepeatAt.indexOf('repeat') !== -1) {
        agenda.schedule(cleanRepeatAt, agendaConstDefinition.send_reminder, schedule);
        return;
      }

      const job: Job<JobAttributesData> = worker.create(agendaConstDefinition.send_reminder, schedule);
      job.schedule(cleanRepeatAt);
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
