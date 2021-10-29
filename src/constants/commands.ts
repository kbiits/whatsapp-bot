import { helpReply } from '../handlers/help';
import { reminderAdd } from '../handlers/reminders/reminderAdd';
import { CommandMap } from '../types/type';

export const commands: CommandMap = {
  help: helpReply,
  'reminders_add_(.+)_msg_(.+)': reminderAdd,
};
