"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.load = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
function load() {
    dotenv_1.default.config();
    return {
        DISCORD_TOKEN: process.env.DISCORD_TOKEN,
        GUILD_ID: process.env.GUILD_ID,
        CHANNEL_ID: process.env.CHANNEL_ID,
        // ROLE_ID: process.env.ROLE_ID,
    };
}
exports.load = load;
