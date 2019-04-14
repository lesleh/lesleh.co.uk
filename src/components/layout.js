/**
 * Layout component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { StaticQuery, graphql } from "gatsby"

import Header from "./header"
import "../stylesheets/_style.scss"

const Layout = ({ children }) => (
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
        <div class="main-grid">
        <header class="site-header">
          <h1><span>Lesleh</span>.co.uk</h1>
          <button class="site-nav__hamburger" aria-label="Main menu"><i class="fas fa-bars"></i></button>
        </header>

        <ul class="site-nav">
          <li>
            <a href="#">
              Home <i class="fas fa-fw fa-home"></i>
            </a>
          </li>
          <li>
            <a href="#">
              About <i class="fas fa-fw fa-user-circle"></i>
            </a>
          </li>
          <li>
            <a href="#">
              Photos <i class="fas fa-fw fa-images"></i>
            </a>
          </li>
          <li>
            <a href="#">
              Contact <i class="fas fa-fw fa-envelope"></i>
            </a>
          </li>
        </ul>
          <h1 class="page-title">Title</h1>
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
