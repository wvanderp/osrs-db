import { spawn } from 'child_process';
import { basename } from 'path';
import { cyan, yellow, red } from './colors';

// Utility function to execute a shell script with real-time logging.
// @param scriptPath - The path to the shell script to execute.
// @param args - Optional arguments to pass to the script.
// @returns A promise that resolves when the script execution completes.
export default function executeShellScript(
    scriptPath: string,
    args: string[] = []
): Promise<void> {
    return new Promise((resolve, reject) => {
        const scriptName = basename(scriptPath);
        const childProcess = spawn(scriptPath, args, { shell: true });

        childProcess.stdout.on('data', (data) => {
            console.log(cyan(`[${scriptName} stdout]: ${data}`));
        });

        childProcess.stderr.on('data', (data) => {
            console.error(yellow(`[${scriptName} stderr]: ${data}`));
        });

        childProcess.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                console.error(red(`[${scriptName}] exited with code ${code}`));
                reject(new Error(`Script exited with code ${code}`));
            }
        });

        childProcess.on('error', (error) => {
            console.error(red(`Error spawning script: ${scriptName}`), error);
            reject(error);
        });
    });
}
