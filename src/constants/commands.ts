// import { badQuotes } from '../handlers/badQuotes';
import { helpReply } from '../handlers/help';
import { addReminder } from '../handlers/reminders/addReminder';
import { deleteReminder } from '../handlers/reminders/deleteReminder';
import { getReminders } from '../handlers/reminders/getReminders';
import { convertToSticker } from '../handlers/sticker';
import { CommandMap } from '../types/type';

export const commands: CommandMap = {
  help: helpReply,

  '^reminders_add_for_time_(.+)_msg_(.+)': addReminder,
  '^reminders_list(_with_past)?$': getReminders,
  '^reminders_delete(_with_past)?_(\\d+)$': deleteReminder,
  
  // sticker_please: convertToSticker,

  // '^bad_quotes?_please$': badQuotes,
};
