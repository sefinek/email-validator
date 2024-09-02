const path = require('node:path');

module.exports = {
	entry: './src/index.js',
	mode: 'production',
	output: {
		filename: 'browser.min.js',
		path: path.resolve(__dirname, 'dist'),
		library: 'emailValidator',
		libraryTarget: 'umd',
		globalObject: 'this'
	},
	optimization: {
		minimize: true
	},
	devtool: 'source-map'
};