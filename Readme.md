# Educated Joker Bot

## Description

Educated Joker Bot is a Telegram bot that provides a variety of features to users. It includes a joke generator, algorithm explanation with AI-powered dynamic generation, and helpful commands.

## Features

- Joke Generator: Get random jokes on demand
- Algorithm Explanation:
  - Pre-defined algorithms from a database
  - AI-powered dynamic algorithm generation for algorithms not in the database
- Helpful Commands for easy navigation

## Installation

1. Clone the repository
2. Install dependencies
3. Create a `.env` file and add your bot token and Gemini API key
4. Start the bot

```env
BOT_TOKEN=your_bot_token
GEMINI_KEY=your_gemini_api_key
```

## Usage

1. Start the bot with `/start` command to get started
2. Use the `/joke` command to generate a joke
3. Use the `/algorithm <name>` command to get information about an algorithm
   - If the algorithm exists in the database, it will return the stored information
   - If the algorithm is not in the database, the bot will use AI to dynamically generate information about it
4. Use the `/algohelp` command to get a list of all pre-defined algorithms
5. Use the `/help` command to get a list of all available commands
6. Use the `/about` command to learn about the bot
7. Use the `/contact` command to get developer contact information

## Technical Details

The bot uses:

- Telegraf.js for the Telegram Bot API
- Google's Gemini AI for generating jokes and algorithm information
- MarkdownV2 formatting for better readability in Telegram

## Dependencies

- telegraf
- dotenv
- @google/generative-ai
