/**
 * Function used for validating an email address.
 *
 * @param email - The email address to validate.
 * @example
 * const emailValidator = require('@sefinek/email-validator');
 * const email = 'example@example.com';
 *
 * if (emailValidator.test(email)) {
 *    console.log(`Email ${email} is valid!`);
 * } else {
 *    console.log(`Email ${email} is NOT valid!`);
 * }
 * @returns Returns true if the email address is valid, otherwise false.
 */
declare function test(email: string): boolean;

/**
 * The version of the `email-validator` module.
 */
declare const version: string;

declare const emailValidator: {
    test: typeof test;
    version: typeof version;
};

export = emailValidator;
