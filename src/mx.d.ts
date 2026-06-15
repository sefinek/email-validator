interface VerifyMxOptions {
	/**
	 * DNS server addresses to query instead of the system defaults,
	 * e.g. `['1.1.1.1', '8.8.8.8']`. Each entry may include a port (`'8.8.8.8:53'`).
	 * Uses a dedicated resolver, so the global DNS configuration is left untouched.
	 */
	servers?: string[];

	/**
	 * Per-query timeout in milliseconds before a retry.
	 * @default -1
	 */
	timeout?: number;

	/**
	 * Number of attempts before the lookup is considered failed.
	 * @default 4
	 */
	tries?: number;

	/**
	 * When `true`, the input is first checked against the email syntax validator.
	 * Invalid addresses resolve to `false` without performing a DNS lookup.
	 *
	 * Note: this requires a full email address, so a bare domain (e.g. `'sefinek.net'`)
	 * is rejected when this option is enabled.
	 * @default false
	 */
	validateSyntax?: boolean;
}

/**
 * Resolves `true` if the domain has at least one MX record, otherwise `false`.
 *
 * Node.js only. Relies on `node:dns` and is not part of the browser bundle.
 * Accepts a full email address (the domain after the last `@` is used) or a bare domain.
 * Never throws: DNS failures and invalid input resolve to `false`.
 *
 * @example
 * const verifyMx = require('@sefinek/email-validator/mx');
 *
 * await verifyMx('contact@sefinek.net');                           // system resolvers
 * await verifyMx('contact@sefinek.net', { servers: ['1.1.1.1'] }); // custom DNS
 *
 * @version 2.1.0
 */
declare const verifyMx: (input: string, options?: VerifyMxOptions) => Promise<boolean>;

export = verifyMx;
