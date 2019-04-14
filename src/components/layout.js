/**
 * Layout component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React from "react"
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
        <div className="main-grid">
          <Header />
          <Nav />
        
          <h1 className="page-title">{title}</h1>
          <main className="site-main">
            {children}
          </main>
          <footer className="site-footer">
            <a className="github-link" href="https://github.com/lesleh/lesleh.co.uk3/" title="View source on GitHub">
              <i className="fab fa-github-alt"></i>
            </a>
          </footer>
        </div>
      </>
    )}
  />
)

export default Layout
