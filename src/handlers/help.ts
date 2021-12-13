import { isGroupID, MessageType, proto } from '@adiwajshing/baileys';
import PrefixModel from '../models/Prefix';
import { ResolverFunctionCarry, ResolverResult } from '../types/type';

export const helpReply: ResolverFunctionCarry =
    () =>
        async (message: proto.WebMessageInfo, jid: string): Promise<ResolverResult> => {
            let prefix: string;
            if (isGroupID(jid)) {
                const prefixModel = await PrefixModel.findOne({
                    jid,
                }).exec();
                prefix = prefixModel ? prefixModel.prefix : process.env.DEFAULT_PREFIX;
            } else {
                prefix = process.env.DEFAULT_PREFIX;
            }

            const msg = `
Your prefix : /${prefix}

Usage : /${prefix} _:command_

Command List :

1. help 
    (Show this message)

2. reminders add _:time_ msg _:msg_
    (Add reminder)

3. reminders add _:time_ interval _:interval_ repeat msg _:msg_ 
    (Add repeated reminder, don't forget to set the interval)

4. reminders list 
    (Get active reminders )

5. reminders list with past 
    (Get all reminders including past schedule / non active shedule)

6. reminders delete _:id_
    (Delete reminder, get the id from list command)

7. reminders delete with past _:id_ 
    (Delete reminder including non active / past schedule, get the id from list with past command)

8. sticker please 
    (Convert image to sticker) Note : Use as a caption of your image

9. quotes please 
    (Get random quotes)

10. love meter _:name_ and _:name_
    (Calculate your Love compatibility & chances of successful love relationship)

11. joke pls
    (Get random joke)

12. dark joke pls
    (Get random dark joke)

13. meme pls
    (Get random meme)

14. create role _:name_
    (Create role with given name)

15. delete role _:name_
    (Delete role)

16. roles
    (See all roles in this group chat)

17. assign :mentions... to role _:name_
    (Assign all mentioned users to a role)

18. remove :mentions... from role _:name_
    (Remove all mentioned users from a role)

19. users in role _:name_
    (See all users assigned to the role)

20. change prefix _:your-new-prefix_
    
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
