import { tools } from './Tool';

async function runLinters() {
  for (const tool of tools) {
    await tool.lint();
  }
}

runLinters();
