import { MessageType, proto } from '@adiwajshing/baileys';
import { ResolverFunctionCarry, ResolverResult } from '../types/type';

export const helpReply: ResolverFunctionCarry =
  () =>
  (message: proto.WebMessageInfo, jid: string): ResolverResult => {
    const msg = `
List Commands :

1. help 
    (Show this message)

2. reminders add :time msg :msg 
    (Add reminder)

3. reminders add :time interval :interval repeat msg :msg 
    (Add repeated reminder, don't forget to set the interval)

4. reminders list 
    (Get active reminders )

5. reminders list with past 
    (Get all reminders including past schedule / non active shedule)

6. reminders delete :id 
    (Delete reminder, get the id from list command)

7. reminders delete with past :id 
    (Delete reminder including non active / past schedule, get the id from list with past command)

8. sticker please 
    (Convert image to sticker) Note : Use as a caption of your image

9. quotes please 
    (Get random quotes)

10. bad quotes please 
    (Get random bad quotes)

11. love meter :nama and :nama
    (Calculate your Love compatibility & chances of successful love relationship)

12. joke pls
    (Get random joke)

13. dark joke pls
    (Get random dark joke)

14. create role :name
    (Create role with given name)

15. delete role :name
    (Delete role)

16. roles
    (See all roles in this group chat)

17. assign :mentions... to role :name
    (Assign all mentioned users to a role)

18. remove :mentions... from role :name
    (Remove all mentioned users from a role)

19. users in role :name
    (See all users assigned to the role)
    
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
