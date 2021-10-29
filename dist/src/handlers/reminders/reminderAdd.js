"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reminderAdd = void 0;
var baileys_1 = require("@adiwajshing/baileys");
var agenda_1 = require("../../constants/agenda");
var worker_1 = __importDefault(require("../../worker"));
var reminderAdd = function (matches) {
    return function (message) {
        try {
            var schedule = {
                jid: message.key.remoteJid,
                msg: matches[2].replace('_', ' '),
            };
            worker_1.default.schedule(new Date(Date.now() + 2000 * 60), agenda_1.agendaConstDefinition.send_reminder, schedule);
        }
        catch (_a) {
            return {
                destinationId: message.key.remoteJid,
                message: 'Gagal membuat reminder, Periksa kembali format tanggal',
                type: baileys_1.MessageType.extendedText,
                options: {
                    quoted: message,
                    contextInfo: {
                        quotedMessage: message.message,
                    },
                },
            };
        }
        var msg = "Reminder created";
        return {
            destinationId: message.key.remoteJid,
            message: msg,
            type: baileys_1.MessageType.extendedText,
            options: {
                quoted: message,
                contextInfo: {
                    quotedMessage: message.message,
                },
            },
        };
    };
};
exports.reminderAdd = reminderAdd;
//# sourceMappingURL=reminderAdd.js.map