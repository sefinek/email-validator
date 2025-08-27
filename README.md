# 📨 Email Address Validator
This lightweight module facilitates precise email address validation, returning a `Boolean` value of `true` or `false`.

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
const testEmail = 'contact@sefinek.net';

if (emailValidator.test(testEmail)) {
    console.log(`Email ${testEmail} is valid.`);
} else {
    console.log(`Email ${testEmail} is NOT valid!`);
}
```


## 🌍 » Browser
### jsdelivr.net
```
https://cdn.jsdelivr.net/npm/@sefinek/email-validator@1/dist/email-validator.min.js
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

    <script src="https://cdn.jsdelivr.net/npm/@sefinek/email-validator@1/dist/email-validator.min.js"></script>
    <script>
        const email = 'contact@sefinek.net';
        
        if (emailValidator.test(email)) {
            console.log(`✔️ Email ${email} is valid.`);
        } else {
            console.log(`❎ Email ${email} is NOT valid!`);
        }
    </script>
</body>
</html>
```

### Demo
> https://sefinek.net/npm/email-validator/demo


## ⭐ » Thank you
If you find this module helpful, please consider giving the [repository a star](https://github.com/sefinek/email-validator).
For any questions or issues, please create a new [Issue](https://github.com/sefinek/email-validator/issues/new).


### 📑 » MIT License