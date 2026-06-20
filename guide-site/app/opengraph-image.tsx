import { ImageResponse } from "next/og";
import { BRAND_COLOR, SITE_DESCRIPTION, SITE_NAME } from "~/lib/constants";

export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: "64px",
        background: "#0f1210",
        color: "#f5f7f5",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          background: BRAND_COLOR,
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 900 }}>
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
          }}
        >
          {SITE_NAME}
        </div>
        <div
          style={{
            fontSize: 28,
            lineHeight: 1.4,
            color: "#b8c0b8",
          }}
        >
          {SITE_DESCRIPTION}
        </div>
      </div>
    </div>,
    { ...size },
  );
}
