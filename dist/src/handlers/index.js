"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
var baileys_1 = require("@adiwajshing/baileys");
var checkCommand_1 = __importDefault(require("../utils/checkCommand"));
var replyMessage_1 = require("../utils/replyMessage");
var resolver_1 = require("../utils/resolver");
var handler = function (conn, chat) {
    var _a, _b;
    if (!chat.messages)
        return;
    (_b = (_a = chat.messages) === null || _a === void 0 ? void 0 : _a.all()) === null || _b === void 0 ? void 0 : _b.forEach(function (c) {
        var _a, _b, _c;
        // mark chat as read
        conn.chatRead(c.key.remoteJid, 'read');
        if ((_b = (_a = c.key) === null || _a === void 0 ? void 0 : _a.fromMe) !== null && _b !== void 0 ? _b : true)
            return;
        if (!(0, checkCommand_1.default)((_c = c.message) === null || _c === void 0 ? void 0 : _c.conversation))
            return;
        var chatTextArr = c.message.conversation.split(' ');
        // if there's no command specified
        if (chatTextArr.length === 1) {
            conn.sendMessage(c.key.remoteJid, (0, replyMessage_1.rootMessage)(c.participant), baileys_1.MessageType.extendedText, {
                contextInfo: {
                    mentionedJid: [c.participant],
                },
            });
            return;
        }
        var intents = chatTextArr.slice(1);
        var resolver = (0, resolver_1.getResolver)(intents);
        var sendMessage = resolver(c);
        conn.sendMessage(sendMessage.destinationId, sendMessage.message, sendMessage.type, sendMessage.options);
    });
};
exports.handler = handler;
//# sourceMappingURL=index.js.map