import { isGroupID, MessageType, proto } from "@adiwajshing/baileys";
import PrefixModel from "../../models/Prefix";
import { ResolverFunction, ResolverFunctionCarry, ResolverResult } from "../../types/type";

export const updatePrefix: ResolverFunctionCarry = (matches: RegExpMatchArray): ResolverFunction => async (message: proto.WebMessageInfo, jid: string): Promise<ResolverResult> => {
    if (!isGroupID(jid)) {
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