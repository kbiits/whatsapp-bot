import { MessageType, proto } from "@adiwajshing/baileys";
import PrefixModel from "../../models/Prefix";
import { ResolverFunction, ResolverFunctionCarry, ResolverResult } from "../../types/type";

export const updatePrefix: ResolverFunctionCarry = (matches: RegExpMatchArray): ResolverFunction => async (message: proto.WebMessageInfo, jid: string, isFromGroup: Boolean): Promise<ResolverResult> => {

    if (!isFromGroup) {
        return {
            destinationId: jid,
            message: 'You can only use this feature inside group chat',
            type: MessageType.text,
            options: {
                quoted: message,
            },
        };
    }

    const newPrefix = matches[1].replace(/^ *\//, '');
    if (!newPrefix.length) {
        return {
            destinationId: jid,
            message: "Cannot use empty string for prefix",
            type: MessageType.extendedText,
            options: {
                quoted: message,
            }
        };
    }

    try {
        await PrefixModel.updateOne({
            jid,
        }, {
            prefix: newPrefix,
            jid,
        }, { upsert: true }).exec();
        return {
            destinationId: jid,
            message: `Success, the prefix has been changed to _/${newPrefix}_`,
            type: MessageType.extendedText,
            options: {
                quoted: message,
            }
        }
    } catch (error) {
        console.log('Failed to update prefix');
        console.log("jid : ", jid);
        console.log("newPrefix : ", newPrefix);
        console.log(error);

        return {
            destinationId: jid,
            message: "Failed to update prefix, please try again later",
            type: MessageType.extendedText,
            options: {
                quoted: message,
            }
        }
    }
}