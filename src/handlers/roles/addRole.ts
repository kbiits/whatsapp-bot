import { isGroupID, MessageType, proto } from '@adiwajshing/baileys';
import Role from '../../models/Role';
import conn from '../../socketConnection';
import { ResolverFunction, ResolverFunctionCarry, ResolverResult } from '../../types/type';
import { getOnlyGroupId } from '../../utils/getOnlyGroupId';

export const addRole: ResolverFunctionCarry =
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

    const role = matches[1].replace(/[ @]*/g, '');

    if (!role.match(/^[A-Za-z]+/)) {
      return {
        destinationId: jid,
        message: 'Role hanya boleh berawalan huruf alphabet',
        type: MessageType.text,
        options: {
          quoted: message,
        },
      };
    }

    const groupId = getOnlyGroupId(jid);
    const model = new Role({
      name: role,
      groupId,
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
