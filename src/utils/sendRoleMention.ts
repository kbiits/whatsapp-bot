import { MessageType } from '@adiwajshing/baileys';
import RoleModel from '../models/Role';
import { ResolverResult } from '../types/type';

export const sendRoleMention = async (roles: Array<string>, jid: string): Promise<ResolverResult> => {
  const mentionedJids = await getMentionsFromRoles(roles, jid);

  if (!mentionedJids || !mentionedJids.length) {
    return null;
  }

  return {
    destinationId: jid,
    message: '.',
    type: MessageType.extendedText,
    options: {
      contextInfo: {
        mentionedJid: mentionedJids,
      },
    },
  };
};

export const getMentionsFromRoles = async (roles: Array<string>, groupId: string): Promise<Array<string>> => {
  roles = roles.map((role) => role.replace('@', ''));

  const rolesFound = await RoleModel.find({
    groupId,
    name: {
      $in: roles,
    },
  }).exec();

  if (!rolesFound.length) {
    return null;
  }

  let mentionedJids: Array<string> = [];

  rolesFound.forEach((role) => {
    role.participants && (mentionedJids = mentionedJids.concat(role.participants));
  });

  if (!mentionedJids.length) return null;

  return mentionedJids;
};
