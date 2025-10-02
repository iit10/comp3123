// callbacks.js
// Create two functions and call them, handling resolve/reject.

function resolvedPromise() {
  return new Promise((resolve) => {
    setTimeout(() => resolve("resolvedPromise: success after 500ms"), 500);
  });
}

function rejectedPromise() {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error("rejectedPromise: failure after 500ms")), 500);
  });
}

// Call both separately and handle outcomes
resolvedPromise()
  .then((msg) => console.log("RESOLVED ->", msg))
  .catch((err) => console.error("RESOLVED caught (should not happen):", err.message));

rejectedPromise()
  .then((msg) => console.log("REJECTED ->", msg))
  .catch((err) => console.error("REJECTED caught ->", err.message));

// Optional: show both results together without crashing your script
Promise.allSettled([resolvedPromise(), rejectedPromise()]).then((results) => {
  console.log("\nallSettled summary:");
  for (const r of results) {
    if (r.status === "fulfilled") console.log(" • fulfilled:", r.value);
    else console.log(" • rejected:", r.reason.message);
  }
});
