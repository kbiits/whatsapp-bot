import { MessageType, proto } from '@adiwajshing/baileys';
import { default as Role, default as RoleModel } from '../../models/Role';
import { ResolverFunction, ResolverFunctionCarry, ResolverResult } from '../../types/type';

export const addRole: ResolverFunctionCarry =
  (matches: RegExpMatchArray): ResolverFunction =>
    async (message: proto.WebMessageInfo, jid: string, isFromGroup: Boolean): Promise<ResolverResult> => {
      if (!isFromGroup) {
        return {
          destinationId: jid,
          message: 'You can only use role features inside group chat',
          type: MessageType.text,
          options: {
            quoted: message,
          },
        };
      }

      const role = matches[1].replace(/[ @]*/g, '');

      if (!role.match(/^[A-Za-z]+/)) { // role can only start with alphabet
        return {
          destinationId: jid,
          message: 'Role hanya boleh berawalan huruf alphabet',
          type: MessageType.text,
          options: {
            quoted: message,
          },
        };
      }

      const roleFound = await RoleModel.findOne({
        name: role,
        groupId: jid,
      }).exec();

      if (roleFound) {
        return {
          destinationId: jid,
          message: 'Failed, Duplicate role name',
          type: MessageType.text,
          options: {
            quoted: message,
          },
        };
      }

      const model = new Role({
        name: role,
        groupId: jid,
      });

      try {
        await model.save();
      } catch (error) {
        console.log('Failed to add role, err : ');
        console.log(error);

        return {
          destinationId: jid,
          message: 'Failed to add role',
          type: MessageType.text,
          options: {
            quoted: message,
          },
        };
      }

      return {
        destinationId: jid,
        message: 'Role created',
        type: MessageType.text,
        options: {
          quoted: message,
        },
      };
    };
