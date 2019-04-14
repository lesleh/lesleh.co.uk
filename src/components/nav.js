import React from "react"
import { Link } from "gatsby"

const Nav = () => (
  <ul className="site-nav">
    <li>
      <Link to="/" activeClassName='active'>
        Home <i className="fas fa-fw fa-home"></i>
      </Link>
    </li>
    <li>
      <Link to="/about/" activeClassName='active'>
        About <i className="fas fa-fw fa-user-circle"></i>
      </Link>
    </li>
    <li>
      <Link to="/photos/" activeClassName='active'>
        Photos <i className="fas fa-fw fa-images"></i>
      </Link>
    </li>
    <li>
      <Link to="/contact/" activeClassName='active'>
        Contact <i className="fas fa-fw fa-envelope"></i>
      </Link>
    </li>
  </ul>
)

export default Nav
