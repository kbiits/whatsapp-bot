"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var agenda_1 = __importDefault(require("agenda"));
var mongoConnection_1 = require("../database/mongoConnection");
var sendReminder_1 = __importDefault(require("../jobs/sendReminder"));
var agenda = new agenda_1.default({
    db: { address: mongoConnection_1.mongoConnectionString },
}).processEvery('five minutes');
(0, sendReminder_1.default)(agenda);
agenda.start();
exports.default = agenda;
//# sourceMappingURL=index.js.map