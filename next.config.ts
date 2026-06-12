import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  poweredByHeader: false,
  compress: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Issue #8: Prevent MIME-sniffing attacks
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Issue #9: Prevent clickjacking
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // Issue #10: Prevent data leakage on protocol downgrade
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Issue #7: Prevent XSS & injection attacks
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.plot.ly",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https:",
              "connect-src 'self' https:",
              "frame-ancestors 'self'",
            ].join("; "),
          },
          // Bonus: Disable unused browser APIs
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // Bonus: HSTS for HTTPS enforcement
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          // Bonus: DNS prefetch for performance
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },
    ];
  },
};

export default nextConfig;
