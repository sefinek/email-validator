const path = require('node:path');

module.exports = {
	entry: './src/index.js',
	target: 'web',
	mode: 'production',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'emailValidator.min.js',
		globalObject: 'this',
		library: {
			name: 'emailValidator',
			type: 'umd',
		},
	},
	devtool: 'source-map',
};
