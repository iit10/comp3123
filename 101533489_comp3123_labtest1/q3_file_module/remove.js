// remove.js - Remove all files in Logs directory (if exists), print names, then remove the directory
const fs = require("fs");
const path = require("path");

const logsDir = path.join(__dirname, "Logs");

function removeLogs() {
  if (!fs.existsSync(logsDir)) {
    console.log("No Logs directory found. Nothing to remove.");
    return;
  }

  const files = fs.readdirSync(logsDir);
  if (files.length === 0) {
    console.log("Logs directory is empty.");
  } else {
    for (const f of files) {
      const fp = path.join(logsDir, f);
      fs.unlinkSync(fp);
      console.log(`Deleted file: ${f}`);
    }
  }

  fs.rmdirSync(logsDir);
  console.log("Removed directory: Logs");
}

removeLogs();
