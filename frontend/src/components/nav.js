import React from "react"
import { Link } from "gatsby"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faHome,
  faUserCircle,
  faImages,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons"

const menuItems = [
  {
    title: "Home",
    link: "/",
    icon: faHome,
  },
  {
    title: "About",
    link: "/about/",
    icon: faUserCircle,
  },
  {
    title: "Photos",
    link: "/photos/",
    icon: faImages,
  },
  {
    title: "Contact",
    link: "/contact/",
    icon: faEnvelope,
  },
]

const Nav = () => (
  <ul className="site-nav">
    {menuItems.map((menuItem) => (
      <Link key={menuItem.link} to={menuItem.link} activeClassName="active">
        {menuItem.title} <FontAwesomeIcon icon={menuItem.icon} fixedWidth />
      </Link>
    ))}
  </ul>
)

export default Nav
