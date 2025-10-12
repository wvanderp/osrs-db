/* This file was automatically generated. Do not modify it directly. */

/**
 * Schema for NPCs exported data
 */
export type NPCs = {
  id: number;
  name: string;
  examine?: string | null;
  size?: number | null;
  combatLevel?: number | null;
  attackSpeed?: number | null;
  aggressive?: boolean | null;
  poisonous?: boolean | null;
  immuneToPoison?: boolean | null;
  immuneToVenom?: boolean | null;
  options?: (string | null)[] | null;
  hitpoints?: number | null;
  attributes?: {
    [k: string]: any | undefined;
  } | null;
  animations?: {
    [k: string]: any | undefined;
  } | null;
  params?: {
    [k: string]: any | undefined;
  } | null;
  [k: string]: any | undefined;
}[];
