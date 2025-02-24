# pro-ject-backend
[CCAPDEV] Pro-Ject backend

This repository contains the backend for Group 11's project, which is a forum website (Pro-Ject).

Techstack:
- NodeJS
- MongoDB

**NOTE: Use ES6 for NodeJS (EcmaScript 2015)**

## **Usage**
> [!IMPORTANT]
> **NOTE: What to do after `git clone`**
> ```bash
> npm install
> ```

1. `Run the program`
```bash
npm run dev
```

2. `response`:
```bash
  [nodemon] restarting due to changes...
  [nodemon] starting `node index.js`
  Pro-ject server is running on 4000
```

### Postman

Use Postman to test HTTP requests.

## **Endpoints**

### `/` (base endpoint)
* `request`:
```bash
curl -X POST http://localhost:4000/
```

* `response`:
```bash
Hello World!
```
