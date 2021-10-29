"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var baileys_1 = require("@adiwajshing/baileys");
var handlers_1 = require("./handlers");
var fs_1 = require("fs");
var conn = new baileys_1.WAConnection();
conn.on('open', function () {
    var authInfo = conn.base64EncodedAuthInfo(); // get all the auth info we need to restore this session
    (0, fs_1.writeFileSync)('./auth_info.json', JSON.stringify(authInfo, null, '\t')); // save this info to a file
});
if ((0, fs_1.existsSync)('./auth_info.json') && (0, fs_1.statSync)('./auth_info.json').size >= 5)
    // check the bytes
    conn.loadAuthInfo('./auth_info.json');
conn.on('chat-update', function (chat) { return (0, handlers_1.handler)(conn, chat); });
exports.default = conn;
//# sourceMappingURL=socketConnection.js.map