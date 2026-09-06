import { describe, expect, it } from "vitest";
import { STAGES, stageIndex, stageLabel } from "./stages";

/** Drives the portal progress tracker and the admin stage picker. */

describe("stageIndex", () => {
  it("orders the journey from enquiry to enrolled", () => {
    expect(stageIndex("enquiry")).toBe(0);
    expect(stageIndex("enrolled")).toBe(STAGES.length - 1);
    expect(stageIndex("submitted")).toBeLessThan(stageIndex("offer_received"));
  });

  it("returns -1 for a stage it does not know, including withdrawn", () => {
    // The portal renders "withdrawn" through its own branch rather than the
    // track, so it is deliberately absent from STAGES.
    expect(stageIndex("withdrawn")).toBe(-1);
    expect(stageIndex("not_a_stage")).toBe(-1);
  });
});

describe("stageLabel", () => {
  it("labels known stages", () => {
    expect(stageLabel("documents_pending")).toBe("Documents pending");
    expect(stageLabel("cas_issued")).toBe("CAS issued");
  });

  it("special-cases withdrawn", () => {
    expect(stageLabel("withdrawn")).toBe("Withdrawn");
  });

  it("echoes an unknown stage rather than rendering undefined", () => {
    expect(stageLabel("not_a_stage")).toBe("not_a_stage");
  });
});
