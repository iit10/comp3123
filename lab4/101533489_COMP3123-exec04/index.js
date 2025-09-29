const express = require("express");
const app = express();

// Parse JSON request bodies
app.use(express.json());

// ✅ Serve static files in /public (instruction.html will be at /instruction.html)
app.use(express.static("public"));

// GET /hello
app.get("/hello", (req, res) => {
  res.type("text/plain").send("Hello Express JS");
});

// GET /user?firstname=&lastname=  (defaults to Pritesh Patel)
app.get("/user", (req, res) => {
  const firstname = req.query.firstname || "Pritesh";
  const lastname = req.query.lastname || "Patel";
  res.json({ firstname, lastname });
});

// POST /user/:firstname/:lastname  (path params)
app.post("/user/:firstname/:lastname", (req, res) => {
  const { firstname, lastname } = req.params;
  res.json({ firstname, lastname });
});

// POST /users  (expects an array of { firstname, lastname } in JSON body)
app.post("/users", (req, res) => {
  const users = Array.isArray(req.body) ? req.body : [];
  res.json(users);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
