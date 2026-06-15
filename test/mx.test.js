jest.mock('node:dns', () => {
	const resolveMx = jest.fn();
	const setServers = jest.fn();
	const Resolver = jest.fn(() => ({ setServers, resolveMx }));
	Resolver.__setServers = setServers;
	return { promises: { resolveMx, Resolver } };
});

const { resolveMx, Resolver } = require('node:dns').promises;
const setServers = Resolver.__setServers;
const verifyMx = require('../src/mx.js');

afterEach(() => jest.clearAllMocks());

describe('verifyMx', () => {
	test('returns true when the domain has MX records', async () => {
		resolveMx.mockResolvedValue([{ exchange: 'mx.sefinek.net', priority: 10 }]);
		await expect(verifyMx('contact@sefinek.net')).resolves.toBe(true);
		expect(resolveMx).toHaveBeenCalledWith('sefinek.net');
	});

	test('returns false when there are no MX records', async () => {
		resolveMx.mockResolvedValue([]);
		await expect(verifyMx('user@example.com')).resolves.toBe(false);
	});

	test('returns false when the DNS lookup fails', async () => {
		resolveMx.mockRejectedValue(new Error('ENOTFOUND'));
		await expect(verifyMx('user@nonexistent.invalid')).resolves.toBe(false);
	});

	test('accepts a bare domain (no local part)', async () => {
		resolveMx.mockResolvedValue([{ exchange: 'mx', priority: 1 }]);
		await expect(verifyMx('sefinek.net')).resolves.toBe(true);
		expect(resolveMx).toHaveBeenCalledWith('sefinek.net');
	});

	test('uses the domain after the last @', async () => {
		resolveMx.mockResolvedValue([{ exchange: 'mx', priority: 1 }]);
		await expect(verifyMx('weird@local@example.com')).resolves.toBe(true);
		expect(resolveMx).toHaveBeenCalledWith('example.com');
	});

	test.each(['', '   ', '@', 'user@', null, undefined, 42])(
		'returns false without touching DNS for invalid input: %p',
		async input => {
			await expect(verifyMx(input)).resolves.toBe(false);
			expect(resolveMx).not.toHaveBeenCalled();
		}
	);

	test('uses the default resolver when no options are given', async () => {
		resolveMx.mockResolvedValue([{ exchange: 'mx', priority: 1 }]);
		await verifyMx('contact@sefinek.net');
		expect(Resolver).not.toHaveBeenCalled();
		expect(setServers).not.toHaveBeenCalled();
	});

	test('uses a dedicated resolver with custom DNS servers', async () => {
		resolveMx.mockResolvedValue([{ exchange: 'mx', priority: 1 }]);
		await expect(verifyMx('contact@sefinek.net', { servers: ['1.1.1.1', '8.8.8.8'] })).resolves.toBe(true);
		expect(Resolver).toHaveBeenCalledTimes(1);
		expect(setServers).toHaveBeenCalledWith(['1.1.1.1', '8.8.8.8']);
		expect(resolveMx).toHaveBeenCalledWith('sefinek.net');
	});

	test('forwards timeout and tries to the resolver', async () => {
		resolveMx.mockResolvedValue([{ exchange: 'mx', priority: 1 }]);
		await verifyMx('contact@sefinek.net', { timeout: 2000, tries: 2 });
		expect(Resolver).toHaveBeenCalledWith({ timeout: 2000, tries: 2 });
		expect(setServers).not.toHaveBeenCalled();
	});

	describe('validateSyntax', () => {
		test('still verifies MX for a syntactically valid address', async () => {
			resolveMx.mockResolvedValue([{ exchange: 'mx', priority: 1 }]);
			await expect(verifyMx('contact@sefinek.net', { validateSyntax: true })).resolves.toBe(true);
			expect(resolveMx).toHaveBeenCalledWith('sefinek.net');
		});

		test('returns false without touching DNS for an invalid address', async () => {
			await expect(verifyMx('double..dot@example.com', { validateSyntax: true })).resolves.toBe(false);
			expect(resolveMx).not.toHaveBeenCalled();
		});

		test('rejects a bare domain when enabled', async () => {
			await expect(verifyMx('sefinek.net', { validateSyntax: true })).resolves.toBe(false);
			expect(resolveMx).not.toHaveBeenCalled();
		});

		test('accepts a bare domain when disabled (default)', async () => {
			resolveMx.mockResolvedValue([{ exchange: 'mx', priority: 1 }]);
			await expect(verifyMx('sefinek.net')).resolves.toBe(true);
			expect(resolveMx).toHaveBeenCalledWith('sefinek.net');
		});
	});
});
