const emailValidator = require('../src/index.js');

const validEmails = [
	'01234567890@numbers-in-local.net',
	'a@single-character-in-local.org',
	'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@letters-in-local.org',
	'backticks`are`legit@test.com',
	'com@sil.c1m',
	'contact@sefinek.net',
	'country-code-tld@sld.rw',
	'country-code-tld@sld.uk',
	'digit-only-domain-with-subdomain@sub.123.com',
	'digit-only-domain@123.com',
	'example@example.com',
	'john.doe@example.co',
	'letters-in-sld@123.com',
	'local@dash-in-sld.com',
	'local@sld.newTLD',
	'local@sub.domains.com',
	'mixed-1234-in-{+^}-local@sld.net',
	'one-character-third-level@a.example.com',
	'one-letter-sld@x.org',
	'single-character-in-sld@x.org',
	't119037jskc_ihndkdoz@aakctgajathzffcsuqyjhgjuxnuulgnhxtnbquwtgxljfayeestsjdbalthtddy.lgtmsdhywswlameglunsaplsblljavswxrltovagexhtttodqedmicsekvpmpuu.pgjvdmvzyltpixvalfbktnnpjyjqswbfvtpbfsngqtmhgamhrbqqvyvlhqigggv.nxqglspfbwdhtfpibcrccvctmoxuxwlunghhwacjtrclgirrgppvshxvrzkoifl',
	'test@test--1.com',
	'the-character-limit@for-each-part.of-the-domain.is-sixty-three-characters.this-is-exactly-sixty-three-characters-so-it-is-valid-blah-blah.com',
	'the-total-length@of-an-entire-address.cannot-be-longer-than-two-hundred-and-fifty-four-characters.and-this-address-is-254-characters-exactly.so-it-should-be-valid.and-im-going-to-add-some-more-words-here.to-increase-the-length-blah-blah-blah-blah-bla.org',
	'uncommon-tld@sld.mobi',
	'uncommon-tld@sld.museum',
	'uncommon-tld@sld.travel',
	'user123@example.io',
	'user@example.aero',
	'user@example.co.uk',
	'user@example.museum',
	'user@example.travel',
	'`a@a.fr',
	'`aa@fr.com',
];

const invalidEmails = [
	' example@example.com',
	'! #$%`|@invalid-characters-in-local.org',
	'&lt;&gt;@[]\\`|@even-more-invalid-characters-in-local.org',
	'&\'*+-./=?^_{}~@other-valid-characters-in-local.net',
	'',
	'(),:;`|@more-invalid-characters-in-local.org',
	'.dot-start-and-end.@sil.com',
	'.local-starts-with-dot@sld.com',
	'@example.com',
	'@missing-local.org',
	'another-invalid-ip@127.0.0.256',
	'dot-first-in-domain@.test.de',
	'dot-on-dot-in-domainname@te..st.de',
	'double@a@com',
	'ex ample@example.com',
	'exa*mple@example.com',
	'exa@mple@example.com',
	'example.com',
	'example@',
	'example@example.com ',
	'invalid',
	'invalid-characters-in-sld@! "#$%(),/;&lt;&gt;_[]`|.org',
	'invalid-ip@127.0.0.1.26',
	'IP-and-port@127.0.0.1:25',
	'local-ends-with-dot.@sld.com',
	'mg@ns.i',
	'missing-at-sign.net',
	'missing-dot-before-tld@com',
	'missing-sld@.com',
	'missing-tld@sld.',
	'partially."quoted"@sld.com',
	'sld-ends-with-dash@sld-.com',
	'sld-starts-with-dashsh@-sld.com',
	'the-character-limit@for-each-part.of-the-domain.is-sixty-three-characters.this-is-exactly-sixty-four-characters-so-it-is-invalid-blah-blah.com',
	'the-local-part-is-invalid-if-it-is-longer-than-sixty-four-characters@sld.net',
	'the-total-length@of-an-entire-address.cannot-be-longer-than-two-hundred-and-fifty-six-characters.and-this-address-is-257-characters-exactly.so-it-should-be-invalid.and-im-going-to-add-some-more-words-here.to-increase-the-length-blah-blah-blah-blah-blah-.org',
	'tr119037jskc_ihndkdoz@d.aakctgajathzffcsuqyjhgjuxnuulgnhxtnbquwtgxljfayeestsjdbalthtddy.lgtmsdhywswlameglunsaplsblljavswxrltovagexhtttodqedmicsekvpmpuu.pgjvdmvzyltpixvalfbktnnpjyjqswbfvtpbfsngqtmhgamhrbqqvyvlhqigggv.nxqglspfbwdhtfpibcrccvctmoxuxwlunghhwacjtrclgirrgppvshxvrzkoifl',
	'trailing-dots@test.de.',
	'two..consecutive-dots@sld.com',
	'unbracketed-IP@127.0.0.1',
	'user@.123',
	'user@.aero',
	'user@.com',
	'user@.example.com',
	'user@.museum',
	'user@.travel',
	'user@123.123.123.123',
	'user@123.123.123.123]',
	'user@com',
	'user@example',
	'boop😽@wp.pl',
	'@wp.pl',
	'@gmail.com',
	'sdafgi/\\\'jhfdshajikdfs.,/akjlhsdfakjhlfdashjkladf/,.kshkljadsfhkljsda/][][\\]rodweimyrycweomymoencwrtymoeqwcrtymoqrewcfymorecqwmyuor;eqwc@gmail.com',
	'user@[123.123.123.123]',
	'ówó@ówó.pl',
];

const validUnsupported = [
	'"back\\slash"@sld.com',
	'"escaped\\"quote"@sld.com',
	'"quoted"@sld.com',
	'"quoted-at-sign@sld.org"@sld.com',
	'"\\e\\s\\c\\a\\p\\e\\d"@sld.com',
	'bracketed-IP-instead-of-domain@[127.0.0.1]',
	'punycode-numbers-in-tld@sld.xn--3e0b707e',
];

describe('Email address validation', () => {
	describe.each(validEmails)('Test valid email addresses', email => {
		it(email, () => {
			expect(emailValidator.test(email)).toBe(true);
		});
	});

	describe.each(invalidEmails)('Test invalid email addresses', email => {
		it(email, () => {
			expect(emailValidator.test(email)).toBe(false);
		});
	});

	describe.each(validUnsupported)('Test valid but unsupported email addresses', email => {
		it(email, () => {
			expect(emailValidator.test(email)).toBe(false);
		});
	});
});
