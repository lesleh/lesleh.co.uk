/**
 * Layout component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React from "react"
import { config } from "@fortawesome/fontawesome-svg-core";
import { StaticQuery, graphql } from "gatsby"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithubAlt } from '@fortawesome/free-brands-svg-icons'

import SEO from "./seo"
import Header from "./header"
import Nav from "./nav"
import "../stylesheets/_style.scss"

config.autoAddCss = false

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
              <FontAwesomeIcon icon={faGithubAlt} />
            </a>
          </footer>
        </div>
      </>
    )}
  />
)

export default Layout
