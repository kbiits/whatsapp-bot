import { MessageType, proto } from '@adiwajshing/baileys';
import { agendaConstDefinition } from '../../constants/agenda';
import { ResolverFunction, ResolverFunctionCarry, ResolverResult } from '../../types/type';
import worker from '../../worker';

export const deleteReminder: ResolverFunctionCarry =
  (matches: RegExpMatchArray): ResolverFunction =>
  async (message: proto.WebMessageInfo, jid: string): Promise<ResolverResult> => {
    const queryJid =
      jid.indexOf('@g.us') === -1
        ? jid
        : {
            $regex: `${jid.replace(/^\d*-/, '')}$`,
          };
    let query = {};
    if (!matches[1])
      query = {
        name: agendaConstDefinition.send_reminder,
        'data.jid': queryJid,
        nextRunAt: { $exists: true, $ne: null, $gte: new Date(Date.now()) },
      };
    else
      query = {
        name: agendaConstDefinition.send_reminder,
        'data.jid': queryJid,
      };
    const jobs = await worker.jobs(query, {
      _id: 1,
    });
    const nthDelete = parseInt(matches[2]);
    if (jobs.length < nthDelete || !jobs[nthDelete - 1]) {
      return {
        destinationId: jid,
        message: `Invalid id`,
        type: MessageType.text,
        options: {
          quoted: message,
        },
      };
    }

    await jobs[nthDelete - 1].remove();

    return {
      destinationId: jid,
      message: 'Reminder deleted',
      type: MessageType.text,
    };
  };
