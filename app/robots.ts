import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://coursecrafter.ai";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/dashboard/explore", "/course/*"],
        disallow: ["/create/*", "/dashboard", "/api/*", "/_next/*", "/*.json"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
