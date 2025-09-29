
# 101533489_COMP3123-exec04

Express JS app for **COMP3123 • exec04**.

> **Rename reminder:** Replace `StudentID` in the folder, ZIP file, and your GitHub repository name with your actual Student ID before submitting.

## Quick start
```bash
# 1) Install
npm install

# 2) Run in dev (auto-restart)
npm run dev

# Or run normally
npm start
```

The server starts at: `http://localhost:3000`

## Endpoints
- **GET** `/hello` → returns plain text `"Hello Express JS"`
- **GET** `/user?firstname=&lastname=` → defaults to `"Pritesh Patel"` if missing
- **POST** `/user/:firstname/:lastname` → echoes path params as JSON
- **POST** `/users` → expects JSON array of users `[{ firstname, lastname }, ...]`

## Static file
The provided `instruction.html` is served at:  
`http://localhost:3000/instruction.html`

## cURL quick tests
```bash
curl http://localhost:3000/hello
curl "http://localhost:3000/user?firstname=John&lastname=Doe"
curl -X POST http://localhost:3000/user/John/Doe
curl -X POST http://localhost:3000/users -H "Content-Type: application/json" -d '[{{"firstname":"Pritesh","lastname":"Patel"}},{{"firstname":"John","lastname":"Doe"}}]'
```

## Postman
A Postman collection file is included: `10153348923-exec04.postman_collection.json`  
Import it to Postman, run each request, and take screenshots of the responses for submission.

## GitHub Repo (how to push)
```bash

git init
git add .
git commit -m "COMP3123 exec04 initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<YourStudentID>_COMP3123-exec04.git
git push -u origin main
```

## ZIP for submission
Submit `101533489_COMP3123-exec04.zip` (or rename to your REAL StudentID before uploading).

