// event-bazaar-frontend\src\app\api\blogs\[slug]\route.ts

import { JSDOM } from "jsdom";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } },
) {
  const { slug } = params;

  try {
    // Fetch post data from WordPress REST API
    const postResponse = await fetch(
      `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/posts?slug=${slug}&_embed`,
      { cache: "no-store" },
    );

    if (!postResponse?.ok) {
      throw new Error("Failed to fetch post");
    }

    const posts = await postResponse?.json();

    if (posts?.length === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Get post data
    const post = posts?.[0];

    // Fetch the actual HTML page to extract CSS and JSON-LD
    const pageUrl = `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/blogs/${slug}`;
    const pageResponse = await fetch(pageUrl, { cache: "no-store" });
    const html = await pageResponse?.text();

    // Parse HTML
    const dom = new JSDOM(html);
    const document = dom?.window?.document;

    // Extract all CSS links
    const cssLinks: string[] = [];
    document?.querySelectorAll('link[rel="stylesheet"]')?.forEach((link) => {
      const href = link?.getAttribute("href");
      if (href) {
        // Make sure URLs are absolute
        if (href?.startsWith("http")) {
          cssLinks?.push(href);
        } else {
          cssLinks?.push(
            `${process.env.NEXT_PUBLIC_WORDPRESS_URL}${href?.startsWith("/") ? "" : "/"}${href}`,
          );
        }
      }
    });

    // Extract inline styles
    const inlineStyles: string[] = [];
    document?.querySelectorAll("style")?.forEach((style) => {
      if (style.textContent) {
        inlineStyles?.push(style?.textContent);
      }
    });

    // Extract and process JSON-LD scripts
    const jsonLdScripts: string[] = [];
    document
      ?.querySelectorAll('script[type="application/ld+json"]')
      ?.forEach((script) => {
        if (script?.textContent) {
          try {
            // Parse JSON to validate and modify URLs
            const jsonData = JSON?.parse(script?.textContent);

            // Handle FAQ schema validation
            if (jsonData?.["@type"] === "FAQPage") {
              if (
                !jsonData?.mainEntity ||
                !Array.isArray(jsonData.mainEntity)
              ) {
                console.log("Skipping FAQ schema: No mainEntity array");
                return;
              }

              // Filter out invalid FAQ entries
              const validFAQs = jsonData.mainEntity.filter((entity: any) => {
                const hasValidQuestion =
                  entity?.name &&
                  typeof entity.name === "string" &&
                  entity.name.trim() !== "";

                const hasValidAnswer =
                  entity?.acceptedAnswer?.text &&
                  typeof entity.acceptedAnswer.text === "string" &&
                  entity.acceptedAnswer.text.trim() !== "" &&
                  entity.acceptedAnswer.text.trim() !== "<p></p>" &&
                  entity.acceptedAnswer.text.trim() !== "<p>&nbsp;</p>";

                return hasValidQuestion && hasValidAnswer;
              });

              // Only include FAQ schema if there are valid entries
              if (validFAQs.length === 0) {
                console.log("Skipping FAQ schema: No valid FAQ entries");
                return;
              }

              // Update the FAQ schema with only valid entries
              jsonData.mainEntity = validFAQs;
            }

            // Function to recursively process object and replace URLs
            const processObject = (obj: any): any => {
              if (!obj || typeof obj !== "object") return obj;

              if (Array.isArray(obj)) {
                return obj.map((item) => processObject(item));
              }

              const newObj = { ...obj };

              Object?.keys(newObj)?.forEach((key) => {
                if (typeof newObj?.[key] === "string") {
                  // Skip image URLs and media files
                  const isMediaUrl =
                    newObj?.[key]?.includes("/wp-content/uploads/") ||
                    newObj?.[key]?.includes("/wp-content/themes/") ||
                    newObj?.[key]?.includes("/wp-content/plugins/") ||
                    newObj?.[key]?.match(
                      /\.(jpg|jpeg|png|gif|webp|svg|css|js|pdf)$/i,
                    );

                  // Skip primaryImageOfPage and similar image properties
                  const isImageProperty =
                    key === "primaryImageOfPage" ||
                    key === "image" ||
                    key === "logo" ||
                    (key === "url" &&
                      (newObj["@type"] === "ImageObject" ||
                        obj["@type"] === "ImageObject"));

                  if (!isMediaUrl && !isImageProperty) {
                    // Replace domain in non-media URLs
                    newObj[key] = newObj?.[key]?.replace(
                      /https?:\/\/content\.eventbazaar\.com/g,
                      "https://eventbazaar.com",
                    );
                  }
                } else if (Array?.isArray(newObj?.[key])) {
                  newObj[key] = newObj[key].map((item: any) =>
                    processObject(item),
                  );
                } else if (
                  typeof newObj?.[key] === "object" &&
                  newObj?.[key] !== null
                ) {
                  newObj[key] = processObject(newObj[key]);
                }
              });

              return newObj;
            };

            const processedJson = processObject(jsonData);

            // Validate the final JSON before adding it
            const jsonString = JSON.stringify(processedJson);
            JSON.parse(jsonString); // This will throw if invalid

            jsonLdScripts?.push(jsonString);
            console.log(`Successfully processed ${jsonData["@type"]} schema`);
          } catch (e) {
            console.error(
              "Error processing JSON-LD script:",
              e,
              script?.textContent?.substring(0, 200),
            );
            // Skip invalid JSON-LD scripts
          }
        }
      });

    // Extract meta title and description
    const metaTitle = document?.querySelector("title")?.textContent || "";
    const metaDescription =
      document
        ?.querySelector('meta[name="description"]')
        ?.getAttribute("content") || "";

    // Extract FAQ schema specifically (only if it has valid entries)
    const faqSchema = jsonLdScripts.find(script => {
      try {
        const parsed = JSON.parse(script);
        return parsed["@type"] === "FAQPage" && 
               parsed.mainEntity && 
               Array.isArray(parsed.mainEntity) && 
               parsed.mainEntity.length > 0;
      } catch {
        return false;
      }
    });

    // Extract article schema from @graph structure
    const articleSchema = jsonLdScripts.find(script => {
      try {
        const parsed = JSON.parse(script);
        if (parsed["@graph"]) {
          return parsed["@graph"].some((item: any) => 
            item["@type"] === "BlogPosting" || item["@type"] === "Article"
          );
        }
        return parsed["@type"] === "BlogPosting" || parsed["@type"] === "Article";
      } catch {
        return false;
      }
    });

    console.log(
      `Extracted ${jsonLdScripts.length} valid JSON-LD scripts for ${slug}`,
    );

    // Return post data with CSS and JSON-LD information
    return NextResponse.json({
      post,
      cssLinks,
      inlineStyles,
      jsonLdScripts,
      faqSchema: faqSchema ? JSON.parse(faqSchema) : null,
      articleSchema: articleSchema ? JSON.parse(articleSchema) : null,
      metaTitle,
      metaDescription,
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json({
      post: "",
      cssLinks: [],
      inlineStyles: [],
      jsonLdScripts: [],
      metaTitle: "",
      metaDescription: "",
    });
  }
}
