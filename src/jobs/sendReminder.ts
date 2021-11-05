import { isGroupID, MessageType } from '@adiwajshing/baileys';
import Agenda, { Job } from 'agenda';
import { agendaConstDefinition } from '../constants/agenda';
import { ReminderScheduleData } from '../types/type';
import sock from './../socketConnection';

export default (agenda: Agenda) => {
  agenda.define(agendaConstDefinition.send_reminder, { concurrency: 3, priority: 10 }, async (job: Job) => {
    try {
      const data: ReminderScheduleData = job.attrs.data! as ReminderScheduleData;
      if (!isGroupID(data.jid)) {
        await sock.sendMessage(data.jid, data.msg, MessageType.text, {
          contextInfo: {
            mentionedJid: data.mentionedJids,
          },
        });
        return;
      }

      if (data.msg.indexOf('@everyone') === -1) {
        await sock.sendMessage(data.jid, data.msg, MessageType.text, {
          contextInfo: {
            mentionedJid: data.mentionedJids,
          }
      });
        return;
      }

      const participants = (await sock.groupMetadata(data.jid)).participants;
      const participantsJids = participants.map((p) => p.jid);

      await sock.sendMessage(data.jid, data.msg, MessageType.extendedText, {
        contextInfo: {
          mentionedJid: participantsJids,
        },
      });
    } catch (err) {
      console.log('Failed to run job, err :');
      console.log(err);
      return;
    }
  });
};
