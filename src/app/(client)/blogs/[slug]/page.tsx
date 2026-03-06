// event-bazaar-frontend\src\app\(client)\blogs\[slug]\page.tsx

import { Metadata } from "next";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

// Import client component with proper "use client" directive
const BlogContent = dynamic(() => import("./BlogContent"), {
  ssr: true,
});

// Fetch post data
async function getBlogData(slug: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_FRONTEND_URL_LOCAL}/api/blogs/${slug}`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching blog data:", error);
    return null;
  }
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const data = await getBlogData(params.slug);

  if (!data || !data?.post) {
    return null;
  }

  const post = data?.post;
  const description = post.excerpt.rendered
    .replace(/<[^>]*>/g, "")
    .substring(0, 160);

  return {
    title: data?.metaTitle || post?.title?.rendered,
    description: data?.metaDescription || description,
    openGraph: {
      title: data?.metaTitle || post?.title?.rendered,
      description: data?.metaDescription || description,
      url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/blogs/${post.slug}`,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.modified,
      images: post._embedded?.["wp:featuredmedia"]?.[0]?.source_url
        ? [{ url: post._embedded["wp:featuredmedia"][0].source_url }]
        : [],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/blogs/${post.slug}`,
    },
  };
}

export default async function BlogDetail({
  params,
}: {
  params: { slug: string };
}) {
  const data = await getBlogData(params.slug);

  if (!data || !data?.post) {
    notFound();
  }

  const { post, cssLinks, inlineStyles, faqSchema, articleSchema } = data;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: process.env.NEXT_PUBLIC_FRONTEND_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blogs",
        item: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/blogs`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title.rendered.replace(/<[^>]*>/g, ""),
        item: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/blogs/${post.slug}`,
      },
    ],
  };

  return (
    <>
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <div className="blog-container">
        <BlogContent
          post={post}
          cssLinks={cssLinks}
          inlineStyles={inlineStyles}
        />
      </div>
    </>
  );
}
