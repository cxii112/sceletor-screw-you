import {load} from "./config";
import {Client, Guild, GuildMember, IntentsBitField, TextChannel, userMention} from "discord.js";

module.exports.main = main;

const INTENTS = [
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMessageTyping,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildPresences,
    IntentsBitField.Flags.Guilds
];

async function prepare() {
    const {
        DISCORD_TOKEN,
        GUILD_ID,
        CHANNEL_ID,
    } = load();

    if (DISCORD_TOKEN === undefined ||
        GUILD_ID === undefined ||
        CHANNEL_ID === undefined)
        throw new Error("Env variables must be defined.");

    const BOT = new Client({intents: INTENTS});
    BOT.once("ready",
        (...args) => {
            let name = BOT.user!.username;
            let timestamp = new Date(BOT.readyTimestamp || 0);
            console.log(`Bot ${name} is ready at ${timestamp.toISOString()}`);
            BOT.guilds.fetch();
        });

    await BOT.login(DISCORD_TOKEN);

    await BOT.guilds.fetch();
    const GUILD = await BOT.guilds.fetch(GUILD_ID);
    if (GUILD === undefined) throw new Error(`No guild w/ id ${GUILD_ID}`);

    const CHANNEL = await GUILD.channels.fetch(CHANNEL_ID);
    if (CHANNEL === undefined) throw new Error(`No channel w/ id ${CHANNEL_ID}`);
    if (!CHANNEL!.isTextBased()) throw new Error(`channel ${CHANNEL?.name} (${CHANNEL?.id}) isn't text channel.`);

    return {
        GUILD,
        CHANNEL
    };
}

async function getMembersOfGuilds(guild: Guild) {
    await guild.members.fetch();

    let membersOfGuild: GuildMember[] = [];
    if (guild.members.cache.size === 0) membersOfGuild = [];
    guild.members.cache.map(member => membersOfGuild.push(member));
    return membersOfGuild;
}

export default async function main() {

    try {
        const {
            GUILD,
            CHANNEL
        } = await prepare();

        let membersOfGuild = await getMembersOfGuilds(GUILD);

        let screwedIndex = Math.floor(Math.random() * membersOfGuild.length);
        let screwed = membersOfGuild[screwedIndex];

        let mention = userMention(screwed.id);

        let textChannel = (CHANNEL as TextChannel);
        await textChannel.send({
            content: `${mention}`,
            files: [{
                attachment: "misc/screw-you.jpg",
                name: "screw-you.jpg",
                description: "Screw You"
            }]
        });
        await textChannel.send({
            files: [{
                attachment: "misc/ill-be-back-again.jpg",
                name: "ill-be-back-again.jpg",
                description: "I'll be back"
            }]
        });
    } catch (e) {
        console.error((e as Error).message);
        process.exit(1);
    }
}
