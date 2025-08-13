import { execSync } from 'child_process';

// Utility function to execute a shell script.
// @param scriptPath - The path to the shell script to execute.
// @param args - Optional arguments to pass to the script.
// @returns The standard output from the script execution.
export default function executeShellScript(
    scriptPath: string,
    args: string[] = []
): string {
    try {
        const command = `${scriptPath} ${args.join(" ")}`;
        return execSync(command, { encoding: "utf-8" });
    } catch (error) {
        console.error(`Error executing script: ${scriptPath}`, error);
        throw error;
    }
}
