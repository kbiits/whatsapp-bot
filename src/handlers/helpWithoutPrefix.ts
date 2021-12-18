import { proto } from "@adiwajshing/baileys";
import conn from "../socketConnection";
import { ResolverFunction, ResolverFunctionCarry, ResolverResult } from "../types/type";
import { helpReply } from "./help";

const helpWithoutPrefix: ResolverFunctionCarry = (matches): ResolverFunction => async (message: proto.WebMessageInfo, jid: string, isFromGroup: boolean): Promise<ResolverResult> => {
    // if chat is from group and not mention the bot
    if (isFromGroup && !message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.includes(conn.user.jid)) {
        return;
    }

    return await helpReply(matches)(message, jid, isFromGroup);
}

export default helpWithoutPrefix;