import { isGroupID, MessageType } from '@adiwajshing/baileys';
import Agenda, { Job } from 'agenda';
import uniq from 'lodash.uniq';
import { agendaConstDefinition } from '../constants/agenda';
import { ReminderScheduleData } from '../types/type';
import { getMentionsFromRoles } from '../utils/sendRoleMention';
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

      if (data.msg.indexOf('@everyone') !== -1) {
        // if there's @everyone text in msg
        const participants = (await sock.groupMetadata(data.jid)).participants;
        const participantsJids = participants.map((p) => p.jid);

        await sock.sendMessage(data.jid, data.msg, MessageType.extendedText, {
          contextInfo: {
            mentionedJid: participantsJids,
          },
        });
        return;
      }

      let matches = data.msg.trim().match(/@[A-Za-z]+.*/g); // role can only start with alphabet
      if (matches && matches.length) {
        const mentionedJids = await getMentionsFromRoles(matches, data.jid);
        mentionedJids &&
          mentionedJids.length &&
          (await sock.sendMessage(data.jid, data.msg, MessageType.extendedText, {
            contextInfo: {
              mentionedJid: uniq(mentionedJids, data.mentionedJids),
            },
          }));
        return;
      }

      await sock.sendMessage(data.jid, data.msg, MessageType.text, {
        contextInfo: {
          mentionedJid: data.mentionedJids,
        },
      });
    } catch (err) {
      console.log('Failed to run job, err :');
      console.log(err);
      console.log('error job : ');
      console.log(JSON.stringify(job.toJSON(), null, 4));
      return;
    }
  });
};
