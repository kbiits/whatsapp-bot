import { MessageType, proto } from '@adiwajshing/baileys';
import { ResolverResult } from '../../types/type';
import worker from './../../worker';

export const deleteAllReminders = async (
  query: Object,
  jid: string,
  message: proto.WebMessageInfo
): Promise<ResolverResult> => {
  try {
    const deleted = await worker.cancel(query);
    return {
      destinationId: jid,
      message: `${deleted} reminders deleted`,
      type: MessageType.extendedText,
      options: {
        quoted: message,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      destinationId: jid,
      message: `Failed to delete all reminders`,
      type: MessageType.extendedText,
      options: {
        quoted: message,
      },
    };
  }
};
