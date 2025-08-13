export interface Tool {
  name: string;
  description: string;
  version: string;

  // dependencies on other tools
  needs: string[];

  run: () => Promise<void>;
}
