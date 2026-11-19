import path from 'node:path';

export default {
	entry: './src/index.js',
	target: 'web',
	mode: 'production',
	output: {
		path: path.resolve(import.meta.dirname, 'dist'),
		filename: 'email-validator.min.js',
		globalObject: 'this',
		library: {
			name: 'emailValidator',
			type: 'umd',
			export: 'default',
		},
	},
	devtool: 'source-map',
};
