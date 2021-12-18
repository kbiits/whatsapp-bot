import { MessageType, proto } from "@adiwajshing/baileys";
import { match } from "assert";
import conn from "../../socketConnection";
import { ResolverFunction, ResolverFunctionCarry, ResolverResult } from "../../types/type";
import { sendRoleMention } from "../../utils/sendRoleMention";

const mentionRole: ResolverFunctionCarry = (matches): ResolverFunction => async (message: proto.WebMessageInfo, jid: string, isFromGroup: Boolean): Promise<ResolverResult> => {
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
    const sendMessage = await sendRoleMention(matches, jid);
    if (!sendMessage) return;
    sendMessage.options && (sendMessage.options.quoted = message);
    return sendMessage;
}

export default mentionRole;