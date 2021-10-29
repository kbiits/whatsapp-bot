"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrongCommands = exports.rootMessage = void 0;
var rootMessage = function (participantId) {
    return "Halo, @" + participantId.split('@')[0];
};
exports.rootMessage = rootMessage;
var wrongCommands = function () {
    return "Maaf, command salah";
};
exports.wrongCommands = wrongCommands;
//# sourceMappingURL=replyMessage.js.map