import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { LETTERS, GLYPH, CAP } from "@/components/brand/logo";

export const alt = "Gradmire — Study Abroad Consultancy";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The mark, as a data URI.
 *
 * Satori rasterises this card, and it does not resolve `currentColor` or a
 * stylesheet, so the fills are written out literally. The geometry is the
 * same array the `Logo` component draws from — there is one copy of the
 * wordmark in this repo and this is it.
 */
function markDataUri(letters: string, cap: string) {
  const body =
    [...LETTERS, ...GLYPH].map((d) => `<path fill="${letters}" d="${d}"/>`).join("") +
    `<path fill="${cap}" d="${CAP}"/>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 263.01 70.8">${body}</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

export default async function OpengraphImage() {
  /*
   * Poppins is vendored beside this file rather than fetched. `next/font`
   * self-hosts the site's copy as woff2, which Satori cannot parse, and
   * without a font passed here the card would silently fall back to a
   * generic grotesque — visibly not the brand.
   *
   * Same family and weights the site already loads via next/font, taken from
   * Google Fonts' TTF builds. Poppins is SIL OFL 1.1, which permits
   * redistribution in a bundle like this.
   */
  const [semibold, regular] = await Promise.all([
    readFile(path.join(process.cwd(), "src/app/poppins-600.ttf")),
    readFile(path.join(process.cwd(), "src/app/poppins-400.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#11446A",
          padding: "72px 80px",
          fontFamily: "Poppins",
        }}
      >
        {/* Knocked out in white: the sky cap sits at 2.78:1 on navy. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={markDataUri("#FFFFFF", "#FFFFFF")} width={420} height={113} alt="" />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 62,
              fontWeight: 600,
              color: "#FFFFFF",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              maxWidth: 900,
            }}
          >
            Find your course. Then find the UK around it.
          </div>
          <div style={{ display: "flex", alignItems: "center", marginTop: 34 }}>
            <div style={{ width: 56, height: 5, background: "#298DC6" }} />
            <div
              style={{
                marginLeft: 20,
                fontSize: 23,
                fontWeight: 400,
                color: "#BBD5E8",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              Study Abroad Consultancy
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Poppins", data: semibold, weight: 600, style: "normal" },
        { name: "Poppins", data: regular, weight: 400, style: "normal" },
      ],
    },
  );
}
