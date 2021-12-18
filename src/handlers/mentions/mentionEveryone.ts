import { MessageType, proto } from "@adiwajshing/baileys";
import conn from "../../socketConnection";
import { ResolverFunction, ResolverFunctionCarry, ResolverResult } from "../../types/type";

const mentionEveryone: ResolverFunctionCarry = (): ResolverFunction => async (message: proto.WebMessageInfo, jid: string, isFromGroup: Boolean): Promise<ResolverResult> => {
    if (!isFromGroup) {
        return {
            destinationId: jid,
            message: "You can only use this feature in a group chat",
            type: MessageType.extendedText,
            options: {
                quoted: message,
            }
        };
    }
    const participantsJids = (await conn.groupMetadata(jid)).participants.map((p) => p.jid) ?? [];
    return {
        destinationId: jid,
        message: '.',
        type: MessageType.extendedText,
        options: {
            quoted: message,
            contextInfo: {
                mentionedJid: participantsJids,
            }
        }
    }
}

export default mentionEveryone;