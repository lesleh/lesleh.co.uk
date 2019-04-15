import React from "react"

import Layout from "../components/layout"
import BlogPost from '../components/blog_post'

const IndexPage = ({ data }) => (
  <Layout title="Posts">
    {data.allMarkdownRemark.edges.map(({ node }) => (
      <BlogPost key={node.id} node={node} includeTitle={true} />
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
