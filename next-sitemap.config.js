/** @type {import('next-sitemap').IConfig} */

module.exports = {
  generateRobotsTxt: true,
  siteUrl: process.env.NEXT_PUBLIC_FRONTEND_URL,
  outDir: 'public',
  generateIndexSitemap: false,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        disallow: [
          `${process.env.NEXT_PUBLIC_FRONTEND_URL}/privacy-policy`,
          `${process.env.NEXT_PUBLIC_FRONTEND_URL}/terms-conditions`,
          `${process.env.NEXT_PUBLIC_FRONTEND_URL}/comments/*`,
          "https://staging.eventbazaar.com/*",
          "https://blogs.eventbazaar.com/*",
          "https://stage.eventbazaar.com/*",
          "https://content.eventbazaar.com/*"
        ],
      },
    ],
  },
  exclude: [
    "/admin/*",
    "/vendor/*",
    "/api/*",
    "!/vendor/sign-up",
    "!/vendor/sign-in",
    "!/vendor/forgot-pin",
    "!/vendor/thank-you",
    "/privacy-policy",
    "/terms-conditions",
    "/inbox",
  ],
  additionalPaths: async (config) => {
    try {
      const getAllPosts = async (page = 1, allPosts = []) => {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/posts?per_page=100&page=${page}&_embed`,
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const posts = await res.json();
        // If no posts returned, we've reached the end
        if (posts.length === 0) {
          return allPosts;
        }

        const updatedPosts = [...allPosts, ...posts];

        // If we got less than 100 posts, we're on the last page
        if (posts.length < 100) {
          return updatedPosts;
        }

        // Otherwise, fetch the next page
        return getAllPosts(page + 1, updatedPosts);
      };

      const allBlogs = await getAllPosts();

      let links = [];
      links = allBlogs.map((blog) =>
        blog.link?.replace(process.env.NEXT_PUBLIC_WORDPRESS_URL, ""),
      );

      const allUrlsRes = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_LOCAL}/site-map-lookup`, {
        cache: "no-store",
      },
      );
      const allUrlsJson = await allUrlsRes.json();

      const defaultEncodingMap = {
        _: "__",
        "-": "_",
        " ": "-",
      };

      const customEncodeURIComponent = (str) => {
        let urlString = str?.trim()?.toLowerCase();

        Object.keys(defaultEncodingMap).forEach((key) => {
          if (urlString?.includes(key)) {
            urlString = urlString?.replaceAll(key, defaultEncodingMap[key]);
          }
        });

        return encodeURIComponent(urlString);
      };

      Object.keys(allUrlsJson?.data)?.map((key) =>
        allUrlsJson?.data?.[key]?.map(
          (i) => (
            links.push(
              `/${customEncodeURIComponent(key)}/${customEncodeURIComponent(i?.name)}`,
            ),
            i?.eventType?.map(
              (j) =>
                links.push(`/${customEncodeURIComponent(key)}/${customEncodeURIComponent(i?.name)}/${customEncodeURIComponent(j?.name)}`),
            )
          )
        ),
      );

      links = links.flat().filter(Boolean);

      return links.map((link) => ({
        loc: `/${link}`,
        lastmod: new Date().toISOString(),
        changefreq: config.changefreq,
        priority: config.priority,
      }));

    } catch (error) {
      console.log(`error from site map additionalPaths : ${error}`);
      return [];
    }
  },
};
