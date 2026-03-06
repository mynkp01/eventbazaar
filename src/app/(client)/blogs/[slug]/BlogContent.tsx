// event-bazaar-frontend\src\app\(client)\blogs\[slug]\BlogContent.tsx

"use client";

import { setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import { useEffect } from "react";
import { scopeCss } from "./scopeStyles";

interface BlogContentProps {
  post: any;
  cssLinks: string[];
  inlineStyles: string[];
}

export default function BlogContent({
  post,
  cssLinks,
  inlineStyles,
}: BlogContentProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    try {
      dispatch(setIsLoading(true));
      const scopeSelector = ".blog-content";

      // Process inline styles with scoping
      inlineStyles?.forEach((style, index) => {
        const scopedStyle = scopeCss(style, scopeSelector);

        const styleEl = document?.createElement("style");
        styleEl.dataset.wpStyle = "true";
        styleEl.textContent = scopedStyle;
        document?.head?.appendChild(styleEl);
      });

      // Load external CSS and scope them
      cssLinks?.forEach((cssUrl, index) => {
        fetch(cssUrl)
          .then((response) => response?.text())
          .then((cssText) => {
            const scopedCss = scopeCss(cssText, scopeSelector);

            const styleEl = document?.createElement("style");
            styleEl.dataset.wpStyle = "true";
            styleEl.textContent = scopedCss;
            document?.head?.appendChild(styleEl);
          })
          .catch((error) => {
            console.error(`Failed to load CSS from ${cssUrl}:`, error);
          });
      });
      dispatch(setIsLoading(false));
    } catch (error) {
      console.error(error);
      dispatch(setIsLoading(false));
    }

    // Cleanup function to remove styles when component unmounts
    return () => {
      document.querySelectorAll('[data-wp-style="true"]').forEach((el) => {
        el.parentNode?.removeChild(el);
      });
    };
  }, [cssLinks, inlineStyles]);

  return (
    <div className="blog-content pt-5">
      <div className="ast-container">
        <article className="post type-post">
          <header className="entry-header">
            <h1
              className="entry-title !flex !justify-center !text-black"
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />

            <div className="entry-meta">
              <span className="posted-on">
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString()}
                </time>
              </span>
              {post._embedded?.["wp:term"]?.[0]?.[0] && (
                <span className="cat-links">
                  <span className="screen-reader-text">Categories</span>
                  <span>{post._embedded["wp:term"][0][0].name}</span>
                </span>
              )}
            </div>
          </header>

          <style>{`
              .blog-content .entry-content h1, .blog-content h1 {
                color: #000;
              }
              .blog-content .entry-content h2, .blog-content h2 {
                color: #000;
              }
              .blog-content .entry-content h3, .blog-content h3 {
                color: #000;
              }
              .blog-content .entry-content h4, .blog-content h4 {
                color: #000;
              }
              .blog-content .entry-content h5, .blog-content h5 {
                color: #000;
              }
              .blog-content .entry-content h6, .blog-content h6 {
                color: #000;
              }
            `}</style>
          <div
            className="entry-content"
            dangerouslySetInnerHTML={{ __html: post.content.rendered }}
          />
        </article>
      </div>
    </div>
  );
}
