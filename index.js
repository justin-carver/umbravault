import { Command } from 'commander';
const commander = new Command();

import inquirer from 'inquirer';
import * as dotenv from 'dotenv';
dotenv.config();

import inquirerPrompt from 'inquirer-autocomplete-prompt';
import Wallpaper, { questions } from './models/wallpaperModel.js';
import connectMongo from './db/driver.js';
import fs from 'fs';
import path from 'path';

let db;

commander
	.name('umbravault')
	.version('0.4', '--version', 'Outputs the current verison number.')
	.usage('[OPTIONS]...')
	.option(
		'-i, --input <file>',
		'The input folder that will be used to upload images and update the DB.'
	)
	.option(
		'-o, --output <file>',
		'The destination of uploaded images will be moved into. These can be saved or deleted.'
	)
	.parse(process.argv);

const options = commander.opts();

const uploadImage = async (imagePath) => {
	try {
		const imageData = fs.readFileSync(
			path.join(process.cwd(), options.input, imagePath)
		);
		const encodedData = imageData.toString('base64');

		const response = await fetch('https://api.imgur.com/3/image', {
			method: 'POST',
			headers: {
				Authorization: `Client-ID ${process.env.CLIENT_ID}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				image: encodedData,
			}),
		});

		const data = await response.json();
		const link = data.data.link;

		console.log(`Image uploaded successfully. Direct link: ${link}`);

		if (link) {
			inquirer.prompt(questions).then(async (answers) => {
				console.log('Trying to connect to Mongo... 🤔');
				try {
					db = db || (await connectMongo());
				} catch (e) {
					throw new Error(`Can't connect to the DB! 😩 ${e}`);
				}
				console.log('Connected! 🎉');
				console.log('Trying to create BSON document... 🖋️');
				// This should represent the Mongo model schema!
				// All of this should be custom data.
				const upload = await Wallpaper.create({
					src: link,
					alt: answers.alt,
					title: answers.title,
					author: answers.author,
					likes: 0,
					views: 0,
					downloads: 0,
					resolution: {
						width: answers.width,
						height: answers.height,
					},
					softDelete: false,
				});
				console.log(`Created document & uploaded! 🤩 \n\n ${upload}`);
				// Once image has been successfully placed in DB (not Imgur)
				// the finished image should be moved to a 'parsed' directory.
				fs.rename(
					path.join(process.cwd(), options.input, imagePath),
					path.join(process.cwd(), options.output, imagePath),
					(err) => {
						if (err) console.error(`Error moving file: ${err}`);
					}
				);
				inquirer
					.prompt({
						type: 'list',
						name: 'restart',
						message: 'Upload another?',
						choices: ['Yes', 'No'],
						default: 'Yes',
					})
					.then((answers) => {
						answers.restart.toLowerCase() === 'yes'
							? init()
							: process.exit();
					});
			});
		}
	} catch (err) {
		console.error(`Error uploading image: ${err}`);
	}
};

const init = async () => {
	// Replace with the path to your directory if using Imgur CDN
	const files = await fs.promises.readdir(
		path.join(process.cwd(), options.input)
	);

	inquirer.registerPrompt('autocomplete', inquirerPrompt);
	inquirer
		.prompt([
			{
				type: 'autocomplete',
				name: 'file',
				message: 'Select a file:',
				source: (answersSoFar, input) => {
					return new Promise(function (resolve, reject) {
						const matches = files.filter(function (file) {
							return file.includes(input || '');
						});

						resolve(matches);
					});
				},
			},
		])
		.then((answers) => {
			uploadImage(answers.file);
		});
};

init();
