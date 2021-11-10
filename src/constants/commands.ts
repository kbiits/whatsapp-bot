import { badQuotes } from '../handlers/badQuotes';
import { helpReply } from '../handlers/help';
import { convertToSticker } from '../handlers/img2sticker';
import { joke } from '../handlers/joke';
import { loveMeter } from '../handlers/loveMeter';
import { randomQuote } from '../handlers/randomQuote';
import { addReminderInterval } from '../handlers/reminders/addReminder';
import { deleteReminder } from '../handlers/reminders/deleteReminder';
import { getReminders } from '../handlers/reminders/getReminders';
import { addRole } from '../handlers/roles/addRole';
import { assignUserToRole } from '../handlers/roles/assignUserToRole';
import { deleteRole } from '../handlers/roles/deleteRole';
import { getUsersForRole } from '../handlers/roles/getUsersForRole';
import { listRole } from '../handlers/roles/listRole';
import { removeUserFromRole } from '../handlers/roles/removeUserFromRole';
import { CommandMap } from '../types/type';

export const commands: CommandMap = {
  '^help$': helpReply,

  '^reminders_add_for_time_(.+)_msg_(.+)': addReminderInterval,
  '^reminders_list(_with_past)?$': getReminders,
  '^reminders_delete?(_with_past)?_(\\d+)$': deleteReminder,

  '^stic?ker_(?:pls|please)$': convertToSticker,

  '^quotes?_(?:pls|please)$': randomQuote,
  '^bad_quotes?_(?:pls|please)$': badQuotes,

  '^love_meter_([A-Za-z0-9_@]+)_(?:and|dan)_([A-Za-z0-9_@]+)$': loveMeter,

  '^(dark_)?joke_(?:pls|please)$': joke,

  '^create_roles?_([a-zA-Z0-9]+)$': addRole,
  '^delete_role_([a-zA-Z0-9]+)$': deleteRole,
  '^roles?$': listRole,
  '^assign_([@ A-Za-z0-9_]+)_to_roles?_([a-zA-Z0-9]+)$': assignUserToRole,
  '^remove_([@ A-Za-z0-9_]+)_from_roles?_([A-Za-z0-9]+)$': removeUserFromRole,
  '^users?_in_roles?_([A-Za-z0-9@]+)$': getUsersForRole,
};
