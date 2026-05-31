const fs = require('fs');

const logPath = 'C:\\Users\\Prathap Selvakumar\\.gemini\\antigravity-ide\\brain\\f3202d0e-a3ea-48da-95dc-d77b4bb5a053\\.system_generated\\logs\\transcript.jsonl';
const lines = fs.readFileSync(logPath, 'utf8').split('\n');

for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].includes('projects.ts') && lines[i].includes('reinforcement-learning-exercise') && lines[i].includes('function')) {
        console.log(lines[i].substring(0, 500) + '...');
        // We'll write this matching line to a temporary file
        fs.writeFileSync('found_script.json', lines[i]);
        break;
    }
}
