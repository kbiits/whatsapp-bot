import { MessageType, proto } from '@adiwajshing/baileys';
import { agendaConstDefinition } from '../../constants/agenda';
import { ResolverFunction, ResolverFunctionCarry, ResolverResult } from '../../types/type';
import worker from '../../worker';
import { deleteAllReminders } from './deleteAllReminder';

export const deleteReminder: ResolverFunctionCarry =
  (matches: RegExpMatchArray): ResolverFunction =>
  async (message: proto.WebMessageInfo, jid: string): Promise<ResolverResult> => {
    let query = getQuery(matches[1], jid);

    if (matches[2].toLowerCase() === 'all') {
      return await deleteAllReminders(query, jid, message);
    }
    const jobs = await worker.jobs(query, {
      _id: 1,
    });

    const idsDelete: Array<string> = matches[2].split(/ *, */);
    if (!jobs.length || !idsDelete.length) {
      return {
        destinationId: jid,
        message: `Invalid id`,
        type: MessageType.text,
        options: {
          quoted: message,
        },
      };
    }

    let count: number = 0;

    if (idsDelete.length == 1) {
      const nthDelete = parseInt(idsDelete[0]);
      await jobs[nthDelete - 1].remove();
      count = 1;
    } else {
      const jids = [];
      for (const idx of idsDelete) {
        const position = parseInt(idx) - 1;
        if (!jobs[position]) {
          return {
            destinationId: jid,
            message: `Invalid id : ${idx}, please check your ids before sending the command`,
            type: MessageType.extendedText,
            options: {
              quoted: message,
            },
          };
        }
        jids.push(jobs[position].attrs._id);
      }
      try {
        const deletedCount = await worker.cancel({
          _id: {
            $in: jids,
          },
        });
        count = deletedCount;
      } catch (error) {
        console.log(error);

        return {
          destinationId: jid,
          message: 'Failed to delete reminders',
          type: MessageType.text,
          options: {
            quoted: message,
          },
        };
      }
    }

    // await jobs[nthDelete - 1].remove();

    return {
      destinationId: jid,
      message: `${count} reminders deleted`,
      type: MessageType.text,
    };
  };

const getQuery = (match: string, jid: string): Object => {
  let query: Object;
  if (!match)
    query = {
      name: agendaConstDefinition.send_reminder,
      'data.jid': jid,
      nextRunAt: { $exists: true, $ne: null, $gte: new Date(Date.now()) },
    };
  else
    query = {
      name: agendaConstDefinition.send_reminder,
      'data.jid': jid,
    };
  return query;
};
