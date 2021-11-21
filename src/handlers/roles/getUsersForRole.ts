import { isGroupID, MessageType } from '@adiwajshing/baileys';
import RoleModel, { Role } from '../../models/Role';
import { ResolverFunction, ResolverFunctionCarry, ResolverResult } from '../../types/type';
import { getOnlyGroupId } from '../../utils/getOnlyGroupId';

export const getUsersForRole: ResolverFunctionCarry =
  (matches: RegExpMatchArray): ResolverFunction =>
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

    const roleName = matches[1].replace(/[ @]*/g, '');
    const groupId = getOnlyGroupId(jid);
    const role = await RoleModel.findOne({
      name: roleName,
      groupId,
    }).exec();

    if (!role) {
      return {
        destinationId: jid,
        message: 'Role not found',
        type: MessageType.text,
        options: {
          quoted: _,
        },
      };
    }

    if (!role.participants?.length) {
      return {
        destinationId: jid,
        message: "There's no users for this role",
        type: MessageType.text,
        options: {
          quoted: _,
        },
      };
    }

    let msg = '';

    role.participants?.forEach((jid) => {
      msg += `@${jid.replace(/(?:-.+)?@.+/, '')} `;
    });

    return {
      destinationId: jid,
      message: msg,
      type: MessageType.text,
      options: {
        quoted: _,
        contextInfo: {
          mentionedJid: role.participants.map((p) => p.replace(/-.+/, '@s.whatsapp.net')),
        },
      },
    };
  };
