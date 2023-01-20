import dotenv from "dotenv";

export function load() {
    dotenv.config();
    return {
        DISCORD_TOKEN: process.env.DISCORD_TOKEN,
        GUILD_ID: process.env.GUILD_ID,
        CHANNEL_ID: process.env.CHANNEL_ID,
        // ROLE_ID: process.env.ROLE_ID,
    };
}
