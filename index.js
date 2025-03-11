const { Telegraf } = require('telegraf');
const dotenv = require('dotenv');
dotenv.config();

const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

const model = genAI.getGenerativeModel(
	{ model: 'gemini-2.0-flash-lite' },
	{
		systemInstruction:
			'You are a helpful assistant that can provide information about algorithms and jokes.',
	}
);

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
		const joke = await model.generateContent('Tell me a joke');

		if (joke.response.text()) {
			ctx.reply(joke.response.text());
		} else {
			ctx.reply('No joke found');
		}
	});

	bot.command('algorithm', async (ctx) => {
		const algorithm = ctx.message.text.split(' ')[1];

		if (!algorithm) {
			ctx.reply(
				'Please specify an algorithm name. Example: /algorithm bubble_sort'
			);
			return;
		}

		const algoName = algorithm.split('_').join(' ');

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
			// Send a waiting message
			const waitMsg = await ctx.reply(
				`Generating information for ${algoName}...`
			);

			try {
				// Use the LLM to generate algorithm information
				const prompt = `Generate detailed information about the "${algoName}" algorithm with the following structure:
1. A brief description of what the algorithm does and its use cases
2. Pseudocode or implementation in a common programming language (preferably JavaScript)
3. Time complexity analysis
4. Space complexity analysis

Format your response as a JSON object with these fields:
{
  "name": "${algoName}",
  "description": "detailed description",
  "code": "implementation code",
  "time_complexity": "e.g., O(n log n)",
  "space_complexity": "e.g., O(n)"
}`;

				const response = await model.generateContent(prompt);
				const responseText = response.response.text();

				// Extract the JSON from the response
				const jsonMatch = responseText.match(/\{[\s\S]*\}/);
				if (!jsonMatch) {
					throw new Error('Could not extract JSON from the response');
				}

				const algoData = JSON.parse(jsonMatch[0]);

				// Send the formatted response
				ctx.reply(
					`*Name:* ${escapeMarkdown(algoData.name)}\n` +
						`*Description:* ${escapeMarkdown(algoData.description)}\n` +
						`*Code:* \`\`\`${escapeMarkdown(algoData.code)}\`\`\`\n` +
						`*Time Complexity:* ${escapeMarkdown(algoData.time_complexity)}\n` +
						`*Space Complexity:* ${escapeMarkdown(algoData.space_complexity)}`,
					{ parse_mode: 'MarkdownV2' }
				);

				// Delete the waiting message
				ctx.telegram
					.deleteMessage(waitMsg.chat.id, waitMsg.message_id)
					.catch((e) => console.log('Could not delete message:', e));
			} catch (error) {
				console.error('Error generating algorithm information:', error);
				ctx.reply(
					`Sorry, I couldn't generate information for "${algoName}". Please try again or use /algohelp to see available algorithms.`
				);
			}
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
