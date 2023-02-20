import pkg from 'mongoose';
const { Schema, model, models } = pkg;

export const questions = [
	{
		type: 'input',
		name: 'title',
		message: 'Title:',
		prefix: '📢',
	},
	{
		type: 'input',
		name: 'alt',
		message: 'Alt Text:',
		prefix: '🖋️',
	},
	{
		type: 'input',
		name: 'author',
		message: 'Author:',
		prefix: '🦄',
		default: 'Unknown',
	},
	{
		type: 'input',
		name: 'width',
		message: 'Width (x):',
		prefix: '↔',
	},

	{
		type: 'input',
		name: 'height',
		message: 'Height (y):',
		prefix: '↕',
	},
];

const wallpaperSchema = new Schema(
	{
		src: String,
		alt: String,
		author: String,
		title: String,
		views: Number,
		likes: Number,
		downloads: Number,
		resolution: {
			width: Number,
			height: Number,
		},
		softDelete: Boolean,
	},
	{ timestamps: true, validateBeforeSave: true }
);

const Wallpaper = models.Wallpaper || model('Wallpaper', wallpaperSchema);

export default Wallpaper;
