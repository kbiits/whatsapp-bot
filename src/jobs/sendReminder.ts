import { MessageType } from '@adiwajshing/baileys';
import Agenda, { Job } from 'agenda';
import { agendaConstDefinition } from '../constants/agenda';
import { ReminderScheduleData } from '../types/type';
import sock from './../socketConnection';

export default (agenda: Agenda) => {
  agenda.define(
    agendaConstDefinition.send_reminder,
    { concurrency: 3, priority: 10 },
    async (job: Job) => {
      console.log('reminder send');
      console.log('job :');
      console.log(job);
      try {
        const data: ReminderScheduleData = job.attrs
          .data! as ReminderScheduleData;
        await sock.sendMessage(
          job.attrs!.data!.jid!,
          data.msg,
          MessageType.text,
        );
      } catch (err) {
        console.log(
          'Failed to run job, attrs.data type is not ReminderScheduleData, err :',
        );
        console.log(err);
        return;
      }
    },
  );
};
