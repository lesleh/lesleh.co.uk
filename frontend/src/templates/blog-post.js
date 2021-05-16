/* eslint-disable react/no-danger */
import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"

const BlogPost = ({ data }) => {
  const post = data.markdownRemark

  const postHtml = () => ({ __html: post.html })

  return (
    <Layout title={post.frontmatter.title}>
      <div>
        <div dangerouslySetInnerHTML={postHtml()} />
      </div>
    </Layout>
  )
}

export default BlogPost

export const query = graphql`
  query ($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
      }
    }
  }
`
