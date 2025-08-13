export interface Tool {
  name: string;
  description: string;
  version: string;

  needs: string[];

  run: () => Promise<void>;
}
