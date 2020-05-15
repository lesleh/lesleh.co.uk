import React from "react"
import { Link } from "gatsby"

const BlogPost = ({ node, includeTitle = false }) => (
  <article className="blog-post">
    {includeTitle && (
      <h2 className="blog-post__title">
        <Link to={node.fields.slug}>
          {node.frontmatter.title}{" "}
          <span className="blog-post__date">{node.frontmatter.date}</span>
        </Link>
      </h2>
    )}
    <p>{node.excerpt}</p>
  </article>
)

export default BlogPost
