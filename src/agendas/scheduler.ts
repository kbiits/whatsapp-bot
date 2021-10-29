// import { WAConnection } from '@adiwajshing/baileys';
// import Agenda, { Job, JobAttributesData } from 'agenda';
// import { agendaConstDefinition } from '../constants/agenda';
// import { ReminderScheduleData, ResolverResult } from '../types/type';
// import agenda from './index';
// import {} from '../jobs/sendReminder';

// export class Scheduler {
//   sock: WAConnection;
//   agenda: Agenda;
//   constructor(sock: WAConnection, agenda: Agenda) {
//     this.sock = sock;
//     this.agenda = agenda;
//   }

//   async sendReminderMessage(msg: ResolverResult) {
//     await this.sock.sendMessage(
//       msg.destinationId,
//       msg.message,
//       msg.type,
//       msg.options,
//     );
//   }

//   setReminder(jid: string, msg: string, time: string): Job<JobAttributesData> {
//     const data: ReminderScheduleData = {
//       jid,
//       msg,
//     };
//     const job = agenda.create(agendaConstDefinition.send_reminder, data);
//     job.repeatAt(time);
//     job.save();
//     return job;
//   }
// }
