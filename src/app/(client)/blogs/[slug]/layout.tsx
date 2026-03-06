import { Metadata } from "next";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_FRONTEND_URL_LOCAL}/api/blogs/${slug}`,
      {
        cache: "no-store",
      },
    );

    const data = await response?.json();
    if (!data || !data?.post) {
      return {
        title: "",
        description: "",
      };
    }
    const post = data?.post;

    const description = post.excerpt.rendered
      .replace(/<[^>]*>/g, "")
      .substring(0, 160);

    return {
      title: data?.metaTitle || post?.title?.rendered,
      description: data?.metaDescription || description,
    };
  } catch (e) {
    return {
      title: "",
      description: "",
    };
  }
}

export default function BlogsLayout({ children }) {
  return <div className="blog-container">{children}</div>;
}
