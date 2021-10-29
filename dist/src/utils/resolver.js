"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResolver = void 0;
var commands_1 = require("../constants/commands");
var wrongCommands_1 = require("../handlers/wrongCommands");
var getResolver = function (intents) {
    var string = intents.join('_');
    var regexResult = null;
    for (var _i = 0, _a = Object.keys(commands_1.commands); _i < _a.length; _i++) {
        var key = _a[_i];
        regexResult = string.match(key);
        if (regexResult) {
            return commands_1.commands[key](regexResult);
        }
    }
    return wrongCommands_1.wrongCommands;
};
exports.getResolver = getResolver;
//# sourceMappingURL=resolver.js.map