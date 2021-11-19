import { MessageOptions, MessageType, proto, WALocationMessage, WAMediaUpload } from '@adiwajshing/baileys';

export interface CommandMap {
  [key: string]: ResolverFunctionCarry;
}

export type ResolverFunction = (message: proto.WebMessageInfo, jid: string) => Promise<ResolverResult> | ResolverResult;

export type ResolverFunctionCarry = (matches: RegExpMatchArray) => ResolverFunction;

export interface ResolverResult {
  destinationId: string;
  message:
    | string
    | proto.ExtendedTextMessage
    | WALocationMessage
    | proto.ContactMessage
    | proto.ContactsArrayMessage
    | proto.GroupInviteMessage
    | WAMediaUpload
    | proto.ListMessage
    | proto.ButtonsMessage;
  type: MessageType;
  options?: MessageOptions;
}

export type ReminderScheduleData = {
  jid: string;
  msg: string;
  mentionedJids?: string[];
};