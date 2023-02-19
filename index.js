import inquirer from 'inquirer';
import * as dotenv from 'dotenv';
dotenv.config();

import inquirerPrompt from 'inquirer-autocomplete-prompt';
import Wallpaper, { questions } from './models/wallpaperModel.js';
import connectMongo from './db/driver.js';
import fs from 'fs';
import path from 'path';

const uploadImage = async (imagePath) => {
	try {
		const imageData = fs.readFileSync(imagePath);
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

		const uploadStats = fs.statSync(imagePath, (err, stats) => {
			if (err) {
				console.error(err);
				return;
			}
		});

		console.log(`Image uploaded successfully. Direct link: ${link}`);

		if (link) {
			inquirer.prompt(questions).then(async (answers) => {
				console.log('Trying to connect to Mongo... 🤔');
				await connectMongo();
				console.log('Connected! 🎉');
				console.log('Trying to create the document... 🖋️');
				// This should represent the Mongo model schema!
				// All of this should be custom data.
				const upload = await Wallpaper.create({
					src: link,
					alt: answers.alt,
					author: answers.author,
					fileSize: uploadStats.size,
					likes: 0,
					views: 0,
					resolution: {
						width: answers.width,
						height: answers.height,
					},
				});
				console.log(`Created document! 🤩 \n\n ${upload}`);
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
	const directory = './images'; // Replace with the path to your directory
	const files = await fs.promises.readdir(
		path.join(process.cwd(), directory)
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
			uploadImage(path.join(process.cwd(), `\\images\\${answers.file}`));
		});
};

init();
