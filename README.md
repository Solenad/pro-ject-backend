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

**Testing our "Hello World!" endpoint:**

1. Input URL into HTTP request field
![image](https://github.com/user-attachments/assets/9523c0ca-1a39-4511-97dd-05218c77a98f)

2. Hit "Send"
![image](https://github.com/user-attachments/assets/cad56ac4-9e47-4c73-802d-49a9389d3fa3)

**NOTE: Do not forget to set Header to Content-Type: application/json for JSON responses and requests**
![image](https://github.com/user-attachments/assets/4e1c03f3-8364-42b5-92d0-fde6e02ffcc3)

**NOTE: Do not forget to input body if requesting with JSON**
![image](https://github.com/user-attachments/assets/8131ebec-fc28-4bc1-bef3-38647866bd00)


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
