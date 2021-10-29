"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reminderAdd = void 0;
var baileys_1 = require("@adiwajshing/baileys");
var agenda_1 = require("../../constants/agenda");
var worker_1 = __importDefault(require("../../worker"));
var sendBlockedRepeatInterval = function (message) {
    return {
        destinationId: message.key.remoteJid,
        message: 'Maaf ya, gak bisa seconds ataupun minutes, ni server overload lu mau ganti hah ?',
        type: baileys_1.MessageType.text,
        options: {
            quoted: message,
        },
    };
};
var reminderAdd = function (matches) {
    return function (message) {
        try {
            var cleanRepeatAt = matches[1].replace(/_/g, ' ');
            var cleanMsg = matches[2].replace(/_/g, ' ');
            if (cleanRepeatAt.match(/second?s|minute?s/)) {
                return sendBlockedRepeatInterval(message);
            }
            var schedule = {
                jid: message.key.remoteJid,
                msg: cleanMsg,
            };
            var job = worker_1.default.create(agenda_1.agendaConstDefinition.send_reminder, schedule);
            job.schedule(cleanRepeatAt);
            job.repeatAt(cleanRepeatAt);
            job.save();
        }
        catch (err) {
            console.log('error');
            console.log(err);
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