// Simple ANSI color utilities for linters and scripts
export const colors = {
    reset: "\x1b[0m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    bold: "\x1b[1m",
};

export function colorize(prefix: string, color: keyof typeof colors = "cyan") {
    // pick color (fall back to cyan)
    const c = colors[color] ?? colors.cyan;
    return `${c}${prefix}${colors.reset}`;
}

export const red = (s: string) => `${colors.red}${s}${colors.reset}`;
export const green = (s: string) => `${colors.green}${s}${colors.reset}`;
export const yellow = (s: string) => `${colors.yellow}${s}${colors.reset}`;
export const cyan = (s: string) => `${colors.cyan}${s}${colors.reset}`;
export const blue = (s: string) => `${colors.blue}${s}${colors.reset}`;
export const magenta = (s: string) => `${colors.magenta}${s}${colors.reset}`;
export const bold = (s: string) => `${colors.bold}${s}${colors.reset}`;
