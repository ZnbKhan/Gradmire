import { cn } from "@/lib/utils";

export type BoardRow = {
  code: string;
  subject: string;
  topUniversity: string;
  status: "open" | "soon";
};

/**
 * The signature hero element — an airport departures board of course subjects.
 *
 * This is a real <table>: the prototype used role="img" with an aria-label,
 * which tells assistive tech to discard every row and announce one sentence.
 * The flip-flap styling is unaffected by using correct semantics.
 */
export function DepartureBoard({
  rows,
  intake,
  className,
}: {
  rows: BoardRow[];
  intake: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative rounded-[20px] bg-ink p-[26px_22px_22px] shadow-board",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-2 rounded-[14px] border border-white/10" />

      <div className="mb-1 flex items-center justify-between border-b border-dashed border-white/20 px-1.5 pb-4">
        <span className="font-mono text-[12.5px] uppercase tracking-[0.12em] text-white">
          Gradmire <span className="font-semibold text-gold">Departures</span> · UK
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[11px] text-[#8fe3b6]">
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-[#4CD787] animate-pulse-dot"
          />
          Live intake
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-y-1">
          <caption className="sr-only">
            Course subjects with their top-ranked UK university and whether
            applications are currently open.
          </caption>
          <thead>
            <tr className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-white/50">
              <th scope="col" className="px-1.5 pb-2 pt-2.5 text-left font-normal">
                Subject
              </th>
              <th scope="col" className="px-1.5 pb-2 pt-2.5 text-left font-normal">
                Top university
              </th>
              <th scope="col" className="px-1.5 pb-2 pt-2.5 text-left font-normal">
                Code
              </th>
              <th scope="col" className="px-1.5 pb-2 pt-2.5 text-left font-normal">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.code}>
                <td className="w-[26%] px-1 py-0.5">
                  <span className="flap">{row.subject}</span>
                </td>
                <td className="w-[40%] px-1 py-0.5">
                  <span className="flap">{row.topUniversity}</span>
                </td>
                <td className="w-[16%] px-1 py-0.5 font-mono text-[13px] font-semibold text-gold">
                  {row.code}
                </td>
                <td className="w-[18%] px-1 py-0.5">
                  <span
                    className={cn(
                      "block rounded-[5px] px-2 py-1 text-center font-mono text-[10.5px] uppercase tracking-[0.08em]",
                      row.status === "open"
                        ? "bg-[#4CD787]/[0.13] text-[#8fe3b6]"
                        : "bg-[#f4c06a]/[0.13] text-[#f4c06a]",
                    )}
                  >
                    {row.status === "open" ? "Open" : "Soon"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-1.5 flex items-center justify-between border-t border-dashed border-white/20 px-1.5 pb-0.5 pt-4 font-mono text-[10.5px] uppercase tracking-[0.1em] text-white/50">
        <span>{intake} intake</span>
        <span>{rows.length} subjects tracked</span>
      </div>
    </div>
  );
}
