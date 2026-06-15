# 📨 Email Address Validator
This lightweight module provides precise email address validation, plus optional MX record verification of the domain, returning a `Boolean` value (`true` or `false`).

<div align="center">
    <a href="https://www.npmjs.com/package/@sefinek/email-validator">
        <img src="https://img.shields.io/npm/dm/@sefinek/email-validator" alt="npm downloads">
    </a>
    <a href="https://github.com/sefinek/email-validator/issues">
        <img src="https://img.shields.io/github/issues/sefinek/email-validator" alt="Issues">
    </a>
    <a href="https://github.com/sefinek/email-validator/commits/main">
        <img src="https://img.shields.io/github/last-commit/sefinek/email-validator" alt="Last commit">
    </a>
    <a href="https://www.jsdelivr.com/package/npm/@sefinek/email-validator">
        <img src="https://data.jsdelivr.com/v1/package/npm/@sefinek/email-validator/badge?style=rounded" alt="Stats">
    </a>
</div>


## 🟢 » Node.js
### Installation via npm
```bash
npm install @sefinek/email-validator
```

### Installation via yarn
```bash
yarn add @sefinek/email-validator
```

### Example
```js
const emailValidator = require('@sefinek/email-validator');

const TEST_EMAIL = 'contact@sefinek.net';
if (emailValidator(TEST_EMAIL)) {
    console.log(`Email ${TEST_EMAIL} is valid.`);
} else {
    console.log(`Email ${TEST_EMAIL} is NOT valid!`);
}
```

### MX record verification (Node.js only)
Beyond syntax validation, you can check whether the domain actually accepts mail by verifying its MX records.
The function lives under the `/mx` subpath because it depends on `node:dns` and is therefore **not** included in the browser bundle.
It accepts a full email address (the domain after the last `@` is used) or a bare domain. It never throws and resolves exclusively to a `Boolean`.

```js
const emailValidator = require('@sefinek/email-validator');
const verifyMx = require('@sefinek/email-validator/mx');

const TEST_EMAIL = 'contact@sefinek.net';

// Cheap, synchronous syntax check first; only hit DNS if it passes.
if (emailValidator(TEST_EMAIL) && await verifyMx(TEST_EMAIL)) {
    console.log(`Email ${TEST_EMAIL} is valid and the domain accepts mail.`);
}
```

By default, the system resolvers are used. You can query specific DNS servers (and tune `timeout`/`tries`) via the optional second argument. This uses a dedicated resolver and never mutates the global DNS configuration:

```js
await verifyMx('contact@sefinek.net', {
    servers: ['1.1.1.1', '8.8.8.8'], // each entry may include a port, e.g. '8.8.8.8:53'
    timeout: 2000,                   // ms per query before a retry (-1 = system default)
    tries: 2,                        // attempts before giving up
    validateSyntax: true,            // reject syntactically invalid addresses before any DNS lookup
});
```

With `validateSyntax: true`, the input is first checked against the syntax validator and an invalid address resolves to `false` without a DNS query. Note that this requires a full email address, so a bare domain is rejected when the flag is enabled.


## 🌍 » Browser
### jsdelivr.net
```
https://cdn.jsdelivr.net/npm/@sefinek/email-validator@2/dist/email-validator.min.js
```

### Example
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>email-validator</title>
</head>
<body>
    <h1>email-validator</h1>

    <script src="https://cdn.jsdelivr.net/npm/@sefinek/email-validator@2/dist/email-validator.min.js"></script>
    <script>
        const email = 'contact@sefinek.net';

        if (emailValidator(email)) {
            console.log(`✔️ Email ${email} is valid.`);
        } else {
            console.log(`❎ Email ${email} is NOT valid!`);
        }
    </script>
</body>
</html>
```

### Demo
> https://sefinek.net/projects/email-validator


## ⭐ » Thank you
If you find this module helpful, please consider giving the [repository a star](https://github.com/sefinek/email-validator).
For any questions or issues, please create a new [Issue](https://github.com/sefinek/email-validator/issues/new).

## 🔑 License
Copyright © [Sefinek](https://sefinek.net). Licensed under the [MIT License](LICENSE).