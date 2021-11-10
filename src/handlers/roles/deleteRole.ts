import { isGroupID, MessageType, proto } from '@adiwajshing/baileys';
import RoleModel from '../../models/Role';
import { ResolverFunction, ResolverFunctionCarry, ResolverResult } from '../../types/type';
import { getOnlyGroupId } from '../../utils/getOnlyGroupId';

export const deleteRole: ResolverFunctionCarry =
  (matches: RegExpMatchArray): ResolverFunction =>
  async (message: proto.WebMessageInfo, jid: string): Promise<ResolverResult> => {
    if (!isGroupID(jid)) {
      return {
        destinationId: jid,
        message: 'You can only use role features inside group chat',
        type: MessageType.text,
        options: {
          quoted: message,
        },
      };
    }

    const roleName = matches[1].replace(/[ @]*/g, '');
    const groupId = getOnlyGroupId(jid);

    const result = await RoleModel.deleteOne({
      name: roleName,
      groupId,
    }).exec();

    if (result.deletedCount <= 0) {
      return {
        destinationId: jid,
        message: 'Failed to delete role, role not found',
        type: MessageType.text,
        options: {
          quoted: message,
        },
      };
    }

    return {
      destinationId: jid,
      message: 'Role deleted',
      type: MessageType.text,
      options: {
        quoted: message,
      },
    };
  };
