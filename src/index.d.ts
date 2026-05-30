/**
 * Returns `true` if the email address is valid, otherwise `false`.
 *
 * @example
 * const emailValidator = require('@sefinek/email-validator');
 *
 * emailValidator('contact@sefinek.net'); // true
 * emailValidator('invalid-email');       // false
 *
 * @version 2.0.1
 */
declare const emailValidator: {
	(email: string): boolean;
	readonly version: string;
};

export = emailValidator;
