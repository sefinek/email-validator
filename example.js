const emailValidator = require('./src/index.js');

const TEST_EMAIL = 'contact@sefinek.net';
if (emailValidator(TEST_EMAIL)) {
	console.log(`Email ${TEST_EMAIL} is valid.`);
} else {
	console.log(`Email ${TEST_EMAIL} is NOT valid!`);
}