import { MessageType, proto } from '@adiwajshing/baileys';
import { agendaConstDefinition } from '../../constants/agenda';
import {
  ReminderScheduleData,
  ResolverFunctionCarry,
  ResolverResult,
} from '../../types/type';
import agenda from '../../worker';

export const reminderAdd: ResolverFunctionCarry =
  (matches: RegExpMatchArray) =>
  (message: proto.WebMessageInfo): ResolverResult => {
    try {
      const schedule: ReminderScheduleData = {
        jid: message.key.remoteJid,
        msg: matches[2].replace('_', ' '),
      };
      agenda.schedule(
        new Date(Date.now() + 2000 * 60),
        agendaConstDefinition.send_reminder,
        schedule,
      );
    } catch {
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
