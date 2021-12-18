import helpWithoutPrefix from "../handlers/helpWithoutPrefix";
import mentionEveryone from "../handlers/mentions/mentionEveryone";
import mentionRole from "../handlers/mentions/mentionRole";
import { CommandMap } from "../types/type";

const commandsWithoutPrefix: CommandMap = {
    // 'jodohku': 
    '@everyone': mentionEveryone,
    '@[A-Za-z]+[\\w-]*': mentionRole,
    'help|tolong|bantu': helpWithoutPrefix,
};

export default commandsWithoutPrefix;