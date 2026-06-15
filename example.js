const emailValidator = require('./src/index.js');
const verifyMx = require('./src/mx.js');

console.log(`-- @sefinek/email-validator v${emailValidator.version} --\n`);

const emails = [
	'contact@sefinek.net',
	'contact@abcd.abcd',
	'user.name+tag@example.co.uk',
	'invalid-email',
	'missing@domain',
	'@no-local.com',
	'double..dot@example.com',
	'',
];

(async () => {
	for (const email of emails) {
		const valid = emailValidator(email);
		const mx = valid && await verifyMx(email);
		console.log(`${valid ? '✔' : '✘'} ${email || '(empty string)'}${valid ? ` (MX: ${mx ? '✔' : '✘'})` : ''}`);
	}
})();

// See also: https://sefinek.net/projects/email-validator