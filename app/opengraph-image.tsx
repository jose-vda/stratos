import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Imagem social (Open Graph / Twitter) gerada dinamicamente com a marca.
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "radial-gradient(1000px 500px at 15% 0%, #eef2ff 0%, transparent 60%), radial-gradient(900px 500px at 100% 100%, #f5f3ff 0%, transparent 55%), #ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "22px",
              height: "22px",
              borderRadius: "9999px",
              background: "linear-gradient(90deg, #4f46e5, #7c3aed)",
            }}
          />
          <div
            style={{
              display: "flex",
              fontSize: "32px",
              fontWeight: 600,
              color: "#0a0a0b",
            }}
          >
            Flywheel<span style={{ color: "#a1a1aa" }}>.dev</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              fontSize: "72px",
              fontWeight: 600,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "#0a0a0b",
              maxWidth: "960px",
              display: "flex",
            }}
          >
            Tecnologia à medida para o seu negócio crescer.
          </div>
          <div
            style={{
              fontSize: "30px",
              color: "#52525b",
              maxWidth: "880px",
              display: "flex",
            }}
          >
            Sites · Aplicações · Business Hubs · Automações
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
