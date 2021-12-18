import { MessageType } from '@adiwajshing/baileys';
import RoleModel, { Role } from '../../models/Role';
import { ResolverFunction, ResolverFunctionCarry, ResolverResult } from '../../types/type';

export const listRole: ResolverFunctionCarry =
  (): ResolverFunction =>
    async (_, jid, isFromGroup: Boolean): Promise<ResolverResult> => {
      if (!isFromGroup) {
        return {
          destinationId: jid,
          message: 'You can only use role features inside group chat',
          type: MessageType.text,
          options: {
            quoted: _,
          },
        };
      }

      let roles: Array<Role> = await RoleModel.find({ groupId: jid }).exec();

      if (!roles.length) {
        return {
          destinationId: jid,
          message: "There's no roles for this group chat",
          type: MessageType.text,
          options: {
            quoted: _,
          },
        };
      }

      let msg: string = '';
      roles.forEach((role: Role, i) => {
        msg += `${i + 1}. ${role.name}\n`;
      });

      return {
        destinationId: jid,
        message: msg,
        type: MessageType.text,
        options: {
          quoted: _,
        },
      };
    };
