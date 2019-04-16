import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const Header = class extends Component {
  handleHamburgerClicked = () => {
    const menu = window.document.querySelector('.site-nav');
    if (menu) {
      menu.classList.toggle('is-open');
    }
  }

  render() {
    return (
      <header className="site-header">
        <h1>
          <span>Lesleh</span>
          .co.uk
        </h1>
        <button
          type="button"
          className="site-nav__hamburger"
          aria-label="Main menu"
          onClick={this.handleHamburgerClicked}
        >
          <FontAwesomeIcon icon={faBars} fixedWidth />
        </button>
      </header>
    );
  }
};

export default Header;
