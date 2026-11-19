declare const emailValidator: {
	/**
	 * Returns `true` if the email address is valid, otherwise `false`.
	 *
	 * @example
	 * import emailValidator from '@sefinek/email-validator';
	 *
	 * emailValidator('contact@sefinek.net'); // true
	 * emailValidator('invalid-email');       // false
	 */
	(email: string): boolean;

	/**
	 * The installed package version (semver).
	 */
	readonly version: string;
};

export default emailValidator;
