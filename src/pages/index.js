import React from "react"

import Layout from "../components/layout"

const IndexPage = ({ data }) => (
  <Layout title="Posts">
    {data.allMarkdownRemark.edges.map(({ node }) => (
      <div key={node.id}>
        <h3>
          {node.frontmatter.title}{" "}
          <span>
            — {node.frontmatter.date}
          </span>
        </h3>
        <p>{node.excerpt}</p>
      </div>
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
