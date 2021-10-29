"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrongCommands = void 0;
var baileys_1 = require("@adiwajshing/baileys");
var wrongCommands = function (message) {
    var msg = "Maaf, command salah";
    return {
        destinationId: message.key.remoteJid,
        type: baileys_1.MessageType.text,
        message: msg,
        options: {
            contextInfo: {
                quotedMessage: message.message,
            },
            quoted: message,
        },
    };
};
exports.wrongCommands = wrongCommands;
//# sourceMappingURL=wrongCommands.js.map