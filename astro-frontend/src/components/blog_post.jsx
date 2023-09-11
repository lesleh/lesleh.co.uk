const BlogPost = ({ node, includeTitle = false }) => (
  <article className="blog-post">
    {includeTitle && (
      <h2 className="blog-post__title">
        <a href={node.fields.slug}>
          {node.frontmatter.title}{" "}
          <span className="blog-post__date">{node.frontmatter.date}</span>
        </a>
      </h2>
    )}
    <p>{node.excerpt}</p>
  </article>
);

export default BlogPost;
