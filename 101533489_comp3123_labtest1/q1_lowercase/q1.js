// q1.js
// Function: lowerCaseWords(arr) -> Promise<string[]>
// - resolves to lowercased strings from a mixed array
// - rejects if input is not an array

function lowerCaseWords(arr) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(arr)) {
      return reject(new TypeError("Input must be an array"));
    }
    const words = arr
      .filter((v) => typeof v === "string")
      .map((s) => s.toLowerCase());
    resolve(words);
  });
}

// ----- Demo / sample I/O -----
const sample = ["NodeJS", 123, "Es6", null, "HELLO", {}, "wOrLd"];
lowerCaseWords(sample)
  .then((result) => {
    console.log("Resolved:", result);
    // Expected: ["nodejs", "es6", "hello", "world"]
  })
  .catch((err) => console.error("Rejected:", err.message));
