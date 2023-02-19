import pkg from 'mongoose';
const { Schema, model, models } = pkg;

export const questions = [
	{
		type: 'input',
		name: 'name',
		message: 'Whats your name',
		prefix: `?`,
	},
];

const schema = new Schema(
	{
		datafield: true,
	},
	{ timestamps: true, validateBeforeSave: true }
);

const exampleModel = models.Example || model('Example', schema);

export default exampleModel;
