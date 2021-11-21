import { isGroupID, MessageType } from '@adiwajshing/baileys';
import RoleModel, { Role } from '../../models/Role';
import { ResolverFunction, ResolverFunctionCarry, ResolverResult } from '../../types/type';
import { getOnlyGroupId } from '../../utils/getOnlyGroupId';

export const listRole: ResolverFunctionCarry =
  (): ResolverFunction =>
  async (_, jid): Promise<ResolverResult> => {
    if (!isGroupID(jid)) {
      return {
        destinationId: jid,
        message: 'You can only use role features inside group chat',
        type: MessageType.text,
        options: {
          quoted: _,
        },
      };
    }

    const groupId = getOnlyGroupId(jid);
    let roles: Array<Role> = await RoleModel.find({ groupId }).exec();

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
