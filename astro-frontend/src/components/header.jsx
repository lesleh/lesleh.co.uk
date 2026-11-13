import { Component } from "preact";
import Icon from "./icon";
import { faBars } from "@fortawesome/free-solid-svg-icons";

const Header = class extends Component {
  handleHamburgerClicked = () => {
    const menu = window.document.getElementById("site-nav");
    if (menu) {
      menu.toggleAttribute("data-open");
    }
  };

  render() {
    return (
      <header className="text-center sm:col-start-1 sm:row-start-1 sm:text-end">
        <h1 className="text-title font-light">
          <span className="font-semibold">Lesleh</span>
          .co.uk
        </h1>
        <button
          type="button"
          className="absolute top-0.5 right-0.5 z-5 cursor-pointer border-0 bg-transparent px-3.75 py-2.5 text-[24px] text-primary-inverse outline-none sm:hidden"
          aria-label="Main menu"
          onClick={this.handleHamburgerClicked}
        >
          <Icon icon={faBars} fixedWidth />
        </button>
      </header>
    );
  }
};

export default Header;
