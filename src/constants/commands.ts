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

  '^reminders add (.+) msg ([A-Za-z \n\r]+)$': addReminderInterval,
  '^reminders list( with past)?$': getReminders,
  '^reminders delete?( with past)? ([0-9,]+|all)$': deleteReminder,

  '^stic?ker (?:pls|please)$': convertToSticker,

  '^quotes? (?:pls|please)$': randomQuote,

  '^love meter ([A-Za-z0-9_ @]+) (?:and|dan) ([A-Za-z0-9_ @]+)$': loveMeter,

  '^(dark )?joke (?:pls|please)$': joke,

  '^create roles? ([a-zA-Z0-9]+)$': addRole,
  '^delete role ([a-zA-Z0-9]+)$': deleteRole,
  '^roles?$': listRole,
  '^assign ([@ A-Za-z0-9_ ]+) to roles? ([a-zA-Z0-9]+)$': assignUserToRole,
  '^remove ([@ A-Za-z0-9_ ]+) from roles? ([A-Za-z0-9]+)$': removeUserFromRole,
  '^users? in roles? ([A-Za-z0-9@]+)$': getUsersForRole,
};
