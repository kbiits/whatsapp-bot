import Agenda from 'agenda';
import { mongoConnectionString } from '../database/mongoConnection';
import sendReminder from '../jobs/sendReminder';

const agenda = new Agenda({
  db: { address: mongoConnectionString },
}).processEvery('4 minutes');

sendReminder(agenda);

agenda.start();

export default agenda;
