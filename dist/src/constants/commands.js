"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commands = void 0;
var help_1 = require("../handlers/help");
var reminderAdd_1 = require("../handlers/reminders/reminderAdd");
exports.commands = {
    help: help_1.helpReply,
    'reminders_add_(.+)_msg_(.+)': reminderAdd_1.reminderAdd,
};
//# sourceMappingURL=commands.js.map