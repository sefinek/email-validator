import assert from 'node:assert/strict';
import { promises as dns } from 'node:dns';
import { afterEach, beforeEach, describe, it, mock } from 'node:test';
import verifyMx from '../src/mx.js';

const MX = [{ exchange: 'mx.sefinek.net', priority: 10 }];

let resolveMx;
let setServers;
let Resolver;

beforeEach(() => {
	resolveMx = mock.method(dns, 'resolveMx', async () => MX);
	setServers = mock.fn();
	const dedicatedResolveMx = mock.fn(async () => MX);
	Resolver = mock.method(dns, 'Resolver', class {
		setServers = setServers;
		resolveMx = dedicatedResolveMx;
	});
	Resolver.dedicatedResolveMx = dedicatedResolveMx;
});

afterEach(() => mock.restoreAll());

const lookups = () => resolveMx.mock.calls.map(c => c.arguments[0]);

describe('verifyMx', () => {
	it('returns true when the domain has MX records', async () => {
		assert.equal(await verifyMx('contact@sefinek.net'), true);
		assert.deepEqual(lookups(), ['sefinek.net']);
	});

	it('returns false when there are no MX records', async () => {
		resolveMx.mock.mockImplementation(async () => []);
		assert.equal(await verifyMx('user@example.com'), false);
	});

	it('returns false when the DNS lookup fails', async () => {
		resolveMx.mock.mockImplementation(async () => { throw new Error('ENOTFOUND'); });
		assert.equal(await verifyMx('user@nonexistent.invalid'), false);
	});

	it('accepts a bare domain (no local part)', async () => {
		assert.equal(await verifyMx('sefinek.net'), true);
		assert.deepEqual(lookups(), ['sefinek.net']);
	});

	it('uses the domain after the last @', async () => {
		assert.equal(await verifyMx('weird@local@example.com'), true);
		assert.deepEqual(lookups(), ['example.com']);
	});

	for (const input of ['', '   ', '@', 'user@', null, undefined, 42]) {
		it(`returns false without touching DNS for invalid input: ${String(input)}`, async () => {
			assert.equal(await verifyMx(input), false);
			assert.equal(resolveMx.mock.callCount(), 0);
		});
	}

	it('uses the default resolver when no options are given', async () => {
		await verifyMx('contact@sefinek.net');
		assert.equal(Resolver.mock.callCount(), 0);
		assert.equal(setServers.mock.callCount(), 0);
	});

	it('uses a dedicated resolver with custom DNS servers', async () => {
		assert.equal(await verifyMx('contact@sefinek.net', { servers: ['1.1.1.1', '8.8.8.8'] }), true);
		assert.equal(Resolver.mock.callCount(), 1);
		assert.deepEqual(setServers.mock.calls[0].arguments[0], ['1.1.1.1', '8.8.8.8']);
		assert.deepEqual(Resolver.dedicatedResolveMx.mock.calls[0].arguments, ['sefinek.net']);
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

	it('trims surrounding whitespace from the domain', async () => {
		assert.equal(await verifyMx('contact@sefinek.net   '), true);
		assert.deepEqual(lookups(), ['sefinek.net']);
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
