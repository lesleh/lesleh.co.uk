/**
 * Layout component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { StaticQuery, graphql } from "gatsby"

import SEO from "./seo"
import Header from "./header"
import Nav from "./nav"
import "../stylesheets/_style.scss"

const Layout = ({ title, children }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={data => (
      <>
        <SEO title={title} />
        <div class="main-grid">
          <Header />
          <Nav />
        
          <h1 class="page-title">{title}</h1>
          <main class="site-main">
            {children}
          </main>
          <footer class="site-footer">
            <a class="github-link" href="https://github.com/lesleh/lesleh.co.uk3/" title="View source on GitHub">
              <i class="fab fa-github-alt"></i>
            </a>
          </footer>
        </div>
      </>
    )}
  />
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
