/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import { Helmet } from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"

function SEO({ title }) {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
          }
        }
      }
    `,
  )

  return (
    <Helmet
      htmlAttributes={{
        lang: "en-GB",
      }}
      title={title}
      titleTemplate={`%s | ${site.siteMetadata.title}`}
      meta={[
        {
          name: "Description",
          content: "Personal website of Leslie Hoare",
        },
      ]}
    >
      <link
        rel="preconnect"
        href="https://marketingplatform.google.com"
        crossOrigin="anonymous"
      />
    </Helmet>
  )
}

export default SEO
