/* This file was automatically generated. Do not modify it directly. */

/**
 * Schema for in-game objects exported data
 */
export type Objects = {
  id: number;
  name: string;
  examine?: string | null;
  interactions?: (string | null)[] | null;
  x?: number | null;
  y?: number | null;
  plane?: number | null;
  type?: number | null;
  width?: number | null;
  length?: number | null;
  impenetrable?: boolean | null;
  clipType?: number | null;
  offsetX?: number | null;
  offsetY?: number | null;
  offsetHeight?: number | null;
  ambient?: number | null;
  contrast?: number | null;
  params?: {
    [k: string]: any | undefined;
  } | null;
  [k: string]: any | undefined;
}[];
