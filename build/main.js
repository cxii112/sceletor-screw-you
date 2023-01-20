"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const discord_js_1 = require("discord.js");
module.exports.main = main;
const INTENTS = [
    discord_js_1.IntentsBitField.Flags.GuildMessages,
    discord_js_1.IntentsBitField.Flags.GuildMessageTyping,
    discord_js_1.IntentsBitField.Flags.GuildMembers,
    discord_js_1.IntentsBitField.Flags.GuildPresences,
    discord_js_1.IntentsBitField.Flags.Guilds
];
if (require.main === module) {
    main().finally();
}
async function main() {
    try {
        const { GUILD, CHANNEL } = await prepare();
        let membersOfGuild = await getMembersOfGuilds(GUILD);
        let screwedIndex = Math.floor(Math.random() * membersOfGuild.length);
        let screwed = membersOfGuild[screwedIndex];
        let mention = (0, discord_js_1.userMention)(screwed.id);
        let textChannel = CHANNEL;
        await textChannel.send({
            content: `${mention}`,
            files: [{
                    attachment: "misc/screw-you.jpg",
                    name: "screw-you.jpg",
                    description: "ПОШЕЛ НА ХУЙ"
                }]
        });
        return textChannel.send({
            files: [{
                    attachment: "misc/ill-be-back-again.jpg",
                    name: "ill-be-back-again.jpg",
                    description: "СКЕЛЕТОР ВЕРНЕТСЯ ПОЗЖЕ И ЕЩЕ РАЗ ПОШЛЕТ ТЕБЯ НА ХУЙ"
                }]
        });
        // return;
    }
    catch (e) {
        console.error(e.message);
        process.exit(1);
    }
}
async function prepare() {
    const { DISCORD_TOKEN, GUILD_ID, CHANNEL_ID, } = (0, config_1.load)();
    if (DISCORD_TOKEN === undefined ||
        GUILD_ID === undefined ||
        CHANNEL_ID === undefined)
        throw new Error("Env variables must be defined.");
    const BOT = new discord_js_1.Client({ intents: INTENTS });
    BOT.once("ready", (...args) => {
        if (!BOT.user)
            throw new Error("No user exists.");
        let name = BOT.user.username;
        let timestamp = new Date(BOT.readyTimestamp || 0);
        console.log(`Bot ${name} is ready at ${timestamp.toISOString()}`);
        BOT.guilds.fetch();
    });
    await BOT.login(DISCORD_TOKEN);
    await BOT.guilds.fetch();
    const GUILD = await BOT.guilds.fetch(GUILD_ID);
    if (GUILD === undefined)
        throw new Error(`No guild w/ id ${GUILD_ID}`);
    const CHANNEL = await GUILD.channels.fetch(CHANNEL_ID);
    if (CHANNEL === undefined || CHANNEL === null)
        throw new Error(`No channel w/ id ${CHANNEL_ID}`);
    if (!CHANNEL.isTextBased())
        throw new Error(`channel ${CHANNEL?.name} (${CHANNEL?.id}) isn't text channel.`);
    return {
        GUILD,
        CHANNEL
    };
}
async function getMembersOfGuilds(guild) {
    await guild.members.fetch();
    let membersOfGuild = [];
    if (guild.members.cache.size === 0)
        membersOfGuild = [];
    guild.members.cache.map(member => membersOfGuild.push(member));
    return membersOfGuild;
}
