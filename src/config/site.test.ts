import { describe, expect, it } from "vitest";
import { currentIntake, upcomingIntakes } from "./site";

/**
 * The intakes are generated from the current date rather than listed, because
 * a hardcoded "September 2026" is correct for one year and quietly wrong
 * afterwards. That makes this the classic silent-rot function: nothing throws
 * when it drifts, the consultation form just starts offering a dead intake.
 *
 * Every case therefore passes an explicit `now` — never the real clock.
 */

describe("upcomingIntakes", () => {
  it("offers only intakes still three months out", () => {
    // From September, January is 4 months away and makes the cut; the
    // September that has already started does not.
    expect(upcomingIntakes(new Date("2026-09-06"))).toEqual([
      "January 2027",
      "September 2027",
      "January 2028",
    ]);
  });

  it("keeps an intake offerable right up to the lead-time boundary", () => {
    // Late May is just inside the 3-month lead for a September start.
    expect(upcomingIntakes(new Date("2026-05-20"))[0]).toBe("September 2026");
  });

  it("drops an intake once it falls inside the lead time", () => {
    // By late November, January is under three months away and is gone.
    expect(upcomingIntakes(new Date("2026-11-30"))).toEqual([
      "September 2027",
      "January 2028",
      "September 2028",
    ]);
  });

  it("returns them soonest first, across a year boundary", () => {
    expect(upcomingIntakes(new Date("2026-01-15"))).toEqual([
      "September 2026",
      "January 2027",
      "September 2027",
    ]);
  });

  it("honours the requested count", () => {
    expect(upcomingIntakes(new Date("2026-09-06"), 1)).toEqual(["January 2027"]);
    expect(upcomingIntakes(new Date("2026-09-06"), 5)).toHaveLength(5);
  });
});

describe("currentIntake", () => {
  it("is the soonest offerable intake", () => {
    expect(currentIntake(new Date("2026-09-06"))).toBe("January 2027");
    expect(currentIntake(new Date("2026-01-15"))).toBe("September 2026");
  });
});
