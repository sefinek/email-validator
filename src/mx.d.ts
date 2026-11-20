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

	/**
	 * What to return when the lookup fails for a transient reason (timeout, SERVFAIL,
	 * refused connection), so the answer is unknown. Definitive answers (the domain does not
	 * exist or has no mail records) always resolve to `false`.
	 *
	 * Set to `true` to avoid rejecting real users during a DNS outage.
	 * @default false
	 */
	failOpen?: boolean;
}

/**
 * Resolves `true` if the domain can receive mail, otherwise `false`.
 *
 * A domain qualifies when it has at least one MX record, or, per RFC 5321 (implicit MX), no MX
 * records but an A/AAAA record. A null MX (RFC 7505, `MX 0 .`) means the domain accepts no mail
 * and resolves to `false`. Internationalized domains are converted to punycode before the lookup.
 *
 * Node.js only. Relies on `node:dns` and is not part of the browser bundle.
 * Accepts a full email address (the domain after the last `@` is used) or a bare domain.
 * Never throws: invalid input and definitive DNS answers resolve to `false`, transient DNS
 * failures resolve to `false` unless `failOpen` is set.
 *
 * @example
 * import verifyMx from '@sefinek/email-validator/mx';
 *
 * await verifyMx('contact@sefinek.net');                           // system resolvers
 * await verifyMx('contact@sefinek.net', { servers: ['1.1.1.1'] }); // custom DNS
 *
 * @version 3.0.0
 */
declare const verifyMx: (input: string, options?: VerifyMxOptions) => Promise<boolean>;

export default verifyMx;
