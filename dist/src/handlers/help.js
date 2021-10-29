"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.helpReply = void 0;
var baileys_1 = require("@adiwajshing/baileys");
var helpReply = function () {
    return function (message) {
        var msg = "List Commands :\n  1. help (Menampilkan bantuan)\n  2. reminders add :id (Menambah reminder)\n  3. reminders remove :id (Menghapus reminder)\n  ";
        return {
            destinationId: message.key.remoteJid,
            message: msg,
            type: baileys_1.MessageType.text,
            options: {
                quoted: message,
                contextInfo: {
                    quotedMessage: message.message,
                },
            },
        };
    };
};
exports.helpReply = helpReply;
//# sourceMappingURL=help.js.map