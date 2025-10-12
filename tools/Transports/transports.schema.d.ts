/* This file was automatically generated. Do not modify it directly. */

/**
 * Schema for transport interaction definitions (e.g., wilderness obelisks).
 */
export type Transports = {
  /**
   * @minItems 3
   * @maxItems 3
   */
  origin?: [number, number, number];
  destination?: null | [number, number, number];
  menuOption?: string;
  menuTarget?: string | null;
  objectID?: number | null;
  skills?: any[] | null;
  items?: any[] | null;
  quests?: any[] | null;
  duration?: number | null;
  displayInfo?: {
    [k: string]: any | undefined;
  } | null;
  [k: string]: any | undefined;
}[];
