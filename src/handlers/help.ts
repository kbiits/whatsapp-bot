import { MessageType, proto } from '@adiwajshing/baileys';
import { ResolverFunctionCarry, ResolverResult } from '../types/type';

export const helpReply: ResolverFunctionCarry =
  () =>
  (message: proto.WebMessageInfo, jid: string): ResolverResult => {
    const msg = `List Commands :
  1. help (Show this message)
  2. reminders add for time :time (repeat)? msg :msg (Add reminder, repeat if yo)
  3. reminders list (Get active reminders )
  4. reminders list with past (Get all reminders including past schedule / non active shedule)
  5. reminders delete :id (Delete reminder, get the id from list command)
  6. reminders delete with past :id (Delete reminder including non active / past schedule, get the id from list with past)
  `;

    return {
      destinationId: jid,
      message: msg,
      type: MessageType.text,
      options: {
        quoted: message,
        contextInfo: {
          quotedMessage: message.message,
        },
      },
    };
  };
