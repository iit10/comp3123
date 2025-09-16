// index.js
const http = require("http");
const employees = require("./Employee"); // use Employee module

console.log("Lab 03 -  NodeJs");

// Define Server Port
const port = process.env.PORT || 8081;

// Create Web Server using CORE API
const server = http.createServer((req, res) => {
  // default to JSON unless we return HTML on "/"
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "GET") {
    res.statusCode = 405;
    return res.end(JSON.stringify({ error: http.STATUS_CODES[405] }));
  }

  if (req.url === "/") {
    res.setHeader("Content-Type", "text/html");
    return res.end("<h1>Welcome to Lab Exercise 03</h1>");
  }

  if (req.url === "/employee") {
    return res.end(JSON.stringify(employees));
  }

  if (req.url === "/employee/names") {
    const names = employees
      .map((e) => `${e.firstName} ${e.lastName}`)
      .sort();
    return res.end(JSON.stringify(names));
  }

  if (req.url === "/employee/totalsalary") {
    const total = employees.reduce((sum, e) => sum + e.Salary, 0);
    return res.end(JSON.stringify({ total_salary: total }));
  }

  // fallback 404
  res.statusCode = 404;
  res.end(JSON.stringify({ error: http.STATUS_CODES[404] }));
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
