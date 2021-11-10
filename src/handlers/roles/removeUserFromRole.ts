import { MessageType, proto } from '@adiwajshing/baileys';
import RoleModel from '../../models/Role';
import { ResolverFunction, ResolverFunctionCarry, ResolverResult } from '../../types/type';
import { getOnlyGroupId } from '../../utils/getOnlyGroupId';
import diff from 'lodash.difference';
import union from 'lodash.union';

export const removeUserFromRole: ResolverFunctionCarry =
  (matches: RegExpMatchArray): ResolverFunction =>
  async (message: proto.WebMessageInfo, jid: string): Promise<ResolverResult> => {
    const users = matches[1].trim();
    const roleName = matches[2].replace(/[ @]*/g, '');
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
          quoted: message,
        },
      };
    }

    if (users.indexOf('@everyone') !== -1) {
      role.participants = [];
      await role.save();
      return {
        destinationId: jid,
        message: 'Success',
        type: MessageType.text,
        options: {
          quoted: message,
        },
      };
    }

    let removedJids: Array<string> = [];
    if (users.indexOf('@me') !== -1) {
      message.participant && removedJids.push(message.participant);
    }

    removedJids = union(removedJids, message.message?.extendedTextMessage?.contextInfo?.mentionedJid ?? []);
    if (!removedJids.length) {
      return {
        destinationId: jid,
        message: "There's no user to remove",
        type: MessageType.text,
        options: {
          quoted: message,
        },
      };
    }

    role.participants = diff(role.participants ?? [], removedJids);
    await role.save();
    return {
      destinationId: jid,
      message: 'Success',
      type: MessageType.text,
      options: {
        quoted: message,
      },
    };
  };
