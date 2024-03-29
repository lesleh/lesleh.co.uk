import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import BlogPost from "../components/blog_post"

const IndexPage = ({ data }) => (
  <Layout title="Posts">
    <p><a href="https://ridomovies.tv/movies/spirited-away-watch-online-2001-rd11-rd13">Cassie click here for Spirited Away</a></p>
    {data.allMarkdownRemark.edges.map(({ node }) => (
      <BlogPost key={node.id} node={node} includeTitle />
    ))}
  </Layout>
)

export default IndexPage

export const query = graphql`
  query {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      totalCount
      edges {
        node {
          fields {
            slug
          }
          id
          frontmatter {
            title
            date(formatString: "DD MMMM, YYYY")
          }
          excerpt
        }
      }
    }
  }
`
