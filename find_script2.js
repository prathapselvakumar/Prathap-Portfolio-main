const fs = require('fs');

const logPath = 'C:\\Users\\Prathap Selvakumar\\.gemini\\antigravity-ide\\brain\\f3202d0e-a3ea-48da-95dc-d77b4bb5a053\\.system_generated\\logs\\transcript.jsonl';
const lines = fs.readFileSync(logPath, 'utf8').split('\n');

for (let i = lines.length - 1; i >= 0; i--) {
    if (!lines[i]) continue;
    try {
        const step = JSON.parse(lines[i]);
        if (step.tool_calls) {
            for (const call of step.tool_calls) {
                if (call.name === 'run_command' && call.arguments && call.arguments.CommandLine && call.arguments.CommandLine.includes('projects.ts') && call.arguments.CommandLine.includes('reinforcement-learning-exercise') && call.arguments.CommandLine.includes('terminalSnippets')) {
                    fs.writeFileSync('recovered_script.txt', call.arguments.CommandLine);
                    console.log('Found it!');
                    return;
                }
            }
        }
    } catch (e) {}
}
console.log('Not found');
