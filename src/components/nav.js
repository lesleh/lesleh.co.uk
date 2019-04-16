import React from 'react';
import { Link } from 'gatsby';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faUserCircle,
  faImages,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons';

const Nav = () => (
  <ul className="site-nav">
    <li>
      <Link to="/" activeClassName="active">
        Home
        {' '}
        <FontAwesomeIcon icon={faHome} fixedWidth />
      </Link>
    </li>
    <li>
      <Link to="/about/" activeClassName="active">
        About
        {' '}
        <FontAwesomeIcon icon={faUserCircle} fixedWidth />
      </Link>
    </li>
    <li>
      <Link to="/photos/" activeClassName="active">
        Photos
        {' '}
        <FontAwesomeIcon icon={faImages} fixedWidth />
      </Link>
    </li>
    <li>
      <Link to="/contact/" activeClassName="active">
        Contact
        {' '}
        <FontAwesomeIcon icon={faEnvelope} fixedWidth />
      </Link>
    </li>
  </ul>
);

export default Nav;
