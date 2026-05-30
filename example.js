const emailValidator = require('./src/index.js');

console.log(`-- @sefinek/email-validator v${emailValidator.version} --\n`);

const emails = [
	'contact@sefinek.net',
	'user.name+tag@example.co.uk',
	'invalid-email',
	'missing@domain',
	'@no-local.com',
	'double..dot@example.com',
	'',
];

for (const email of emails) {
	const valid = emailValidator(email);
	console.log(`${valid ? '✔' : '✘'} ${email || '(empty string)'}`);
}

// See also: https://sefinek.net/projects/email-validator