const { Telegraf } = require('telegraf');
const dotenv = require('dotenv');

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

try {
	bot.start((ctx) =>
		ctx.reply(
			'Welcome to Educated Joker Bot 🤡\n Created By Ayush\n\n /help for more info'
		)
	);

	bot.help((ctx) =>
		ctx.reply(
			'/start - Start the bot\n/joke - Get a joke\n/algorithm <name> - Get an algorithm\n/help - Get help\n/about - About the bot\n/contact - Contact the developer'
		)
	);

	bot.command('joke', async (ctx) => {
		const joke = await fetch('https://v2.jokeapi.dev/joke/Any?type=single');
		const data = await joke.json();
		if (data.joke) {
			ctx.reply(data.joke);
		} else {
			ctx.reply('No joke found');
		}
	});

	bot.command('algorithm', (ctx) => {
		const algorithm = ctx.message.text.split(' ')[1];
		const data = require('./algorithms.json');
		if (data.algorithms[algorithm]) {
			ctx.reply(
				`*Name:* ${escapeMarkdown(data.algorithms[algorithm].name)}\n` +
					`*Description:* ${escapeMarkdown(
						data.algorithms[algorithm].description
					)}\n` +
					`*Code:* \`\`\`${escapeMarkdown(
						data.algorithms[algorithm].code
					)}\`\`\`\n` +
					`*Time Complexity:* ${escapeMarkdown(
						data.algorithms[algorithm].time_complexity
					)}\n` +
					`*Space Complexity:* ${escapeMarkdown(
						data.algorithms[algorithm].space_complexity
					)}`,
				{ parse_mode: 'MarkdownV2' }
			);
		} else {
			ctx.reply('use /algohelp help to get the list of algorithms');
		}
	});

	bot.command('algohelp', (ctx) => {
		const data = require('./algorithms.json');
		ctx.reply(Object.keys(data.algorithms).join('\n'));
	});

	bot.command('about', (ctx) => {
		ctx.reply(
			'Educated Joker Bot 🤡\n Created By Ayush\n\n /help for more info'
		);
	});

	bot.command('contact', (ctx) => {
		ctx.reply('Name: Ayush\nEmail: ayushrajput8021@gmail.com');
	});

	bot.on('text', (ctx) => {
		if (ctx.message.text === 'hi' || ctx.message.text === 'Hello') {
			ctx.reply('Hello');
		} else {
			ctx.reply('I am sorry, I cannot do that');
		}
	});

	// Start bot using polling mode
	bot.launch().then(() => console.log('Bot is running in polling mode'));
} catch (error) {
	console.log(error);
}

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

function escapeMarkdown(text) {
	return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
}
