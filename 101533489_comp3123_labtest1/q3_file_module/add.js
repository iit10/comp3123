// add.js - Create Logs directory and 10 log files, then list them
const fs = require("fs");
const path = require("path");

const logsDir = path.join(__dirname, "Logs");

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  } else {
    console.log(`Directory already exists: ${dirPath}`);
  }
}

function createLogs() {
  ensureDir(logsDir);
  process.chdir(logsDir); // move into Logs/

  for (let i = 1; i <= 10; i++) {
    const fname = `log-${i}.txt`;
    const content = `This is log file #${i}\nTimestamp: ${new Date().toISOString()}\n`;
    fs.writeFileSync(fname, content, "utf8");
    console.log(`Created: ${fname}`);
  }
}

createLogs();
