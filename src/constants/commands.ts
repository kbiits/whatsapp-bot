import { badQuotes } from '../handlers/badQuotes';
import { helpReply } from '../handlers/help';
import { convertToSticker } from '../handlers/img2sticker';
import { joke } from '../handlers/joke';
import { loveMeter } from '../handlers/loveMeter';
import { randomQuote } from '../handlers/randomQuote';
import { addReminderInterval } from '../handlers/reminders/addReminder';
import { deleteReminder } from '../handlers/reminders/deleteReminder';
import { getReminders } from '../handlers/reminders/getReminders';
import { CommandMap } from '../types/type';

export const commands: CommandMap = {
  help: helpReply,

  '^reminders_add_for_time_(.+)_msg_(.+)': addReminderInterval,
  '^reminders_list(_with_past)?$': getReminders,
  '^reminders_delete(_with_past)?_(\\d+)$': deleteReminder,

  '^sticker_(?:pls|please)$': convertToSticker,
  // '^gif2sticker_(?:pls|please)$': gifToSticker,

  '^quotes?_(?:pls|please)$': randomQuote,
  '^bad_quotes?_(?:pls|please)$': badQuotes,

  '^love_meter_([A-Za-z0-9_]+)_dan_([A-Za-z0-9_]+)$': loveMeter,

  '^(dark_)?joke_(?:pls|please)$': joke,
};
