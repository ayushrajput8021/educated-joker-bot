module.exports = {
	apps: [
		{
			name: 'Educated Joker Bot',
			script: 'index.js',
			watch: true, // Restarts on file changes
			autorestart: true, // Automatically restarts on crash
			max_restarts: 10, // Prevent infinite restart loops
			restart_delay: 5000, // Wait 5s before restarting
			env: {
				NODE_ENV: 'development',
				BOT_TOKEN: process.env.BOT_TOKEN,
			},
			env_production: {
				NODE_ENV: 'production',
				BOT_TOKEN: process.env.BOT_TOKEN,
			},
			error_file: 'logs/err.log', // Log errors
			out_file: 'logs/out.log', // Log standard output
			log_date_format: 'YYYY-MM-DD HH:mm:ss',
		},
	],
};
