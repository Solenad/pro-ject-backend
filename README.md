# pro-ject-backend
[CCAPDEV] Pro-Ject backend

This repository contains the backend for Group 11's project, which is a forum website (Pro-Ject).

Techstack:
- NodeJS
- MongoDB

**NOTE: Use ES6 standard for NodeJS (EcmaScript 2015)**  
**NOTE: Use standard HTTP status for responses**

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

## Using Postman to Test HTTP Requests

### Testing our "Hello World!" Endpoint:

#### 1. Input URL into HTTP Request Field  
![Input URL](https://github.com/user-attachments/assets/e2597005-5ebd-42d6-9abf-702bf16a54e7)

#### 2. Hit "Send"  
![Send Request](https://github.com/user-attachments/assets/cad56ac4-9e47-4c73-802d-49a9389d3fa3)

---

### Important Notes:
- **Set Header:** Ensure that the request includes `Content-Type: application/json` for JSON responses and requests.  
  ![Set Header](https://github.com/user-attachments/assets/4e1c03f3-8364-42b5-92d0-fde6e02ffcc3)

- **Include a Body for JSON Requests:** If your request requires JSON data, input the body properly.  
  ![JSON Body](https://github.com/user-attachments/assets/8131ebec-fc28-4bc1-bef3-38647866bd00)


## **Endpoints**

### `/` (base endpoint)
* `request`:
```bash
curl -X POST http://localhost:3000/
```

* `response`:
```bash
Hello World!
```
