import React from "react"
import { Link } from "gatsby"

const Nav = () => (
  <ul className="site-nav">
    <li>
      <Link to="/">
        Home <i className="fas fa-fw fa-home"></i>
      </Link>
    </li>
    <li>
      <Link to="/about/">
        About <i className="fas fa-fw fa-user-circle"></i>
      </Link>
    </li>
    <li>
      <Link to="/photos/">
        Photos <i className="fas fa-fw fa-images"></i>
      </Link>
    </li>
    <li>
      <Link to="/contact/">
        Contact <i className="fas fa-fw fa-envelope"></i>
      </Link>
    </li>
  </ul>
)

export default Nav
