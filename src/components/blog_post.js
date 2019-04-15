import React from "react"
import { Link } from "gatsby"

const BlogPost = ({ node, includeTitle = false }) => (
  <div>
    { includeTitle &&
      <h2>
        <Link to={node.fields.slug}>
          {node.frontmatter.title}{" "}
          <span>
            — {node.frontmatter.date}
          </span>
        </Link>
      </h2>
    }
    <p>{node.excerpt}</p>
  </div>
)

export default BlogPost
