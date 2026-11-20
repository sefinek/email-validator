import assert from 'node:assert/strict';
import { promises as dns } from 'node:dns';
import { afterEach, beforeEach, describe, it, mock } from 'node:test';
import verifyMx from '../src/mx.js';

const MX = [{ exchange: 'mx.sefinek.net', priority: 10 }];
const dnsError = code => Object.assign(new Error(code), { code });

let resolveMx;
let resolve4;
let resolve6;
let setServers;
let Resolver;
let dedicated;

beforeEach(() => {
	resolveMx = mock.method(dns, 'resolveMx', async () => MX);
	resolve4 = mock.method(dns, 'resolve4', async () => { throw dnsError('ENODATA'); });
	resolve6 = mock.method(dns, 'resolve6', async () => { throw dnsError('ENODATA'); });

	setServers = mock.fn();
	dedicated = { resolveMx: mock.fn(async () => MX), resolve4: mock.fn(), resolve6: mock.fn() };
	Resolver = mock.method(dns, 'Resolver', class {
		setServers = setServers;
		resolveMx = dedicated.resolveMx;
		resolve4 = dedicated.resolve4;
		resolve6 = dedicated.resolve6;
	});
});

afterEach(() => mock.restoreAll());

const lookups = () => resolveMx.mock.calls.map(c => c.arguments[0]);

describe('verifyMx', () => {
	it('returns true when the domain has MX records', async () => {
		assert.equal(await verifyMx('contact@sefinek.net'), true);
		assert.deepEqual(lookups(), ['sefinek.net']);
	});

	it('does not query address records when MX records exist', async () => {
		await verifyMx('contact@sefinek.net');
		assert.equal(resolve4.mock.callCount(), 0);
		assert.equal(resolve6.mock.callCount(), 0);
	});

	it('accepts a bare domain (no local part)', async () => {
		assert.equal(await verifyMx('sefinek.net'), true);
		assert.deepEqual(lookups(), ['sefinek.net']);
	});

	it('uses the domain after the last @', async () => {
		assert.equal(await verifyMx('weird@local@example.com'), true);
		assert.deepEqual(lookups(), ['example.com']);
	});

	it('trims surrounding whitespace from the domain', async () => {
		assert.equal(await verifyMx('contact@sefinek.net   '), true);
		assert.deepEqual(lookups(), ['sefinek.net']);
	});

	it('converts an internationalized domain to punycode', async () => {
		assert.equal(await verifyMx('user@bücher.de'), true);
		assert.deepEqual(lookups(), ['xn--bcher-kva.de']);
	});

	for (const input of ['', '   ', '@', 'user@', null, undefined, 42]) {
		it(`returns false without touching DNS for invalid input: ${String(input)}`, async () => {
			assert.equal(await verifyMx(input), false);
			assert.equal(resolveMx.mock.callCount(), 0);
		});
	}

	describe('missing MX records', () => {
		it('returns false when the domain does not exist', async () => {
			resolveMx.mock.mockImplementation(async () => { throw dnsError('ENOTFOUND'); });
			assert.equal(await verifyMx('user@nonexistent.invalid'), false);
			assert.equal(resolve4.mock.callCount(), 0);
		});

		it('returns false when there are neither MX nor address records', async () => {
			resolveMx.mock.mockImplementation(async () => { throw dnsError('ENODATA'); });
			assert.equal(await verifyMx('user@example.com'), false);
			assert.equal(resolve4.mock.callCount(), 1);
			assert.equal(resolve6.mock.callCount(), 1);
		});

		it('falls back to an A record (implicit MX)', async () => {
			resolveMx.mock.mockImplementation(async () => { throw dnsError('ENODATA'); });
			resolve4.mock.mockImplementation(async () => ['192.0.2.1']);
			assert.equal(await verifyMx('user@example.com'), true);
		});

		it('falls back to an AAAA record (implicit MX)', async () => {
			resolveMx.mock.mockImplementation(async () => []);
			resolve6.mock.mockImplementation(async () => ['2001:db8::1']);
			assert.equal(await verifyMx('user@example.com'), true);
		});
	});

	describe('null MX (RFC 7505)', () => {
		for (const exchange of ['', '.']) {
			it(`returns false for a null MX record (${JSON.stringify(exchange)})`, async () => {
				resolveMx.mock.mockImplementation(async () => [{ exchange, priority: 0 }]);
				resolve4.mock.mockImplementation(async () => ['192.0.2.1']);
				assert.equal(await verifyMx('user@example.com'), false);
				assert.equal(resolve4.mock.callCount(), 0);
			});
		}

		it('returns true when a real MX record accompanies a null one', async () => {
			resolveMx.mock.mockImplementation(async () => [{ exchange: '.', priority: 0 }, ...MX]);
			assert.equal(await verifyMx('user@example.com'), true);
		});
	});

	describe('transient DNS errors', () => {
		for (const code of ['ETIMEOUT', 'ESERVFAIL', 'ECONNREFUSED']) {
			it(`returns false by default on ${code}`, async () => {
				resolveMx.mock.mockImplementation(async () => { throw dnsError(code); });
				assert.equal(await verifyMx('user@example.com'), false);
			});

			it(`returns true with failOpen on ${code}`, async () => {
				resolveMx.mock.mockImplementation(async () => { throw dnsError(code); });
				assert.equal(await verifyMx('user@example.com', { failOpen: true }), true);
			});
		}

		it('treats an unknown error during the address fallback as transient', async () => {
			resolveMx.mock.mockImplementation(async () => { throw dnsError('ENODATA'); });
			resolve4.mock.mockImplementation(async () => { throw dnsError('ETIMEOUT'); });
			assert.equal(await verifyMx('user@example.com'), false);
			assert.equal(await verifyMx('user@example.com', { failOpen: true }), true);
		});

		it('does not fail open for a definitive negative answer', async () => {
			resolveMx.mock.mockImplementation(async () => { throw dnsError('ENOTFOUND'); });
			assert.equal(await verifyMx('user@nonexistent.invalid', { failOpen: true }), false);
		});

		it('does not fail open for invalid input', async () => {
			assert.equal(await verifyMx('', { failOpen: true }), false);
		});
	});

	describe('resolver options', () => {
		it('uses the default resolver when no options are given', async () => {
			await verifyMx('contact@sefinek.net');
			assert.equal(Resolver.mock.callCount(), 0);
			assert.equal(setServers.mock.callCount(), 0);
		});

		it('uses a dedicated resolver with custom DNS servers', async () => {
			assert.equal(await verifyMx('contact@sefinek.net', { servers: ['1.1.1.1', '8.8.8.8'] }), true);
			assert.equal(Resolver.mock.callCount(), 1);
			assert.deepEqual(setServers.mock.calls[0].arguments[0], ['1.1.1.1', '8.8.8.8']);
			assert.deepEqual(dedicated.resolveMx.mock.calls[0].arguments, ['sefinek.net']);
			assert.equal(resolveMx.mock.callCount(), 0);
		});

		it('forwards timeout and tries to the resolver', async () => {
			await verifyMx('contact@sefinek.net', { timeout: 2000, tries: 2 });
			assert.deepEqual(Resolver.mock.calls[0].arguments[0], { timeout: 2000, tries: 2 });
			assert.equal(setServers.mock.callCount(), 0);
		});

		it('uses the default resolver when servers is an empty array', async () => {
			await verifyMx('contact@sefinek.net', { servers: [] });
			assert.equal(Resolver.mock.callCount(), 0);
			assert.equal(setServers.mock.callCount(), 0);
		});

		it('falls back to timeout -1 and tries 4 when only servers is given', async () => {
			await verifyMx('contact@sefinek.net', { servers: ['1.1.1.1'] });
			assert.deepEqual(Resolver.mock.calls[0].arguments[0], { timeout: -1, tries: 4 });
		});
	});

	describe('validateSyntax', () => {
		it('still verifies MX for a syntactically valid address', async () => {
			assert.equal(await verifyMx('contact@sefinek.net', { validateSyntax: true }), true);
			assert.deepEqual(lookups(), ['sefinek.net']);
		});

		it('returns false without touching DNS for an invalid address', async () => {
			assert.equal(await verifyMx('double..dot@example.com', { validateSyntax: true }), false);
			assert.equal(resolveMx.mock.callCount(), 0);
		});

		it('rejects a bare domain when enabled', async () => {
			assert.equal(await verifyMx('sefinek.net', { validateSyntax: true }), false);
			assert.equal(resolveMx.mock.callCount(), 0);
		});
	});
});
