import assert from "node:assert/strict";
import test from "node:test";
import { createObjectLocations } from "./ObjectLocationsTool";

test("joins cache placements to object definitions across supported action formats", () => {
  const locations = createObjectLocations(
    [
      { id: 1, name: "Bank booth", ops: { ops: [null, "Bank"] } },
      { id: 2, name: "Anvil", actions: ["Smith"] },
      { id: 3, name: "Ancient altar", interactions: ["Pray"] },
      { id: 4, name: "Rocks", actions: ["Mine"] },
    ],
    [
      { sourceObjectId: 1, x: 3200, y: 3201, plane: 0 },
      { sourceObjectId: 2, x: 3000, y: 3001, plane: 1 },
      { sourceObjectId: 3, x: 3100, y: 3101, plane: 0 },
      { sourceObjectId: 4, x: 1, y: 2, plane: 0 },
    ],
  );

  assert.deepEqual(
    locations.map(({ name, type, x, y, plane, sourceObjectId }) => ({
      name,
      type,
      x,
      y,
      plane,
      sourceObjectId,
    })),
    [
      {
        name: "Ancient altar",
        type: "altar",
        x: 3100,
        y: 3101,
        plane: 0,
        sourceObjectId: 3,
      },
      {
        name: "Anvil",
        type: "anvil",
        x: 3000,
        y: 3001,
        plane: 1,
        sourceObjectId: 2,
      },
      {
        name: "Bank booth",
        type: "bank_booth",
        x: 3200,
        y: 3201,
        plane: 0,
        sourceObjectId: 1,
      },
    ],
  );
});
