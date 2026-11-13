import Icon from "./icon";
import {
  faHome,
  faUserCircle,
  faImages,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";

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
];

const Nav = () => (
  <ul
    id="site-nav"
    className="m-0 flex list-none flex-col items-end pl-0 max-sm:fixed max-sm:inset-0 max-sm:z-2 max-sm:-translate-x-full max-sm:items-center max-sm:bg-primary max-sm:pt-12.5 max-sm:text-[200%] max-sm:opacity-0 max-sm:transition-all max-sm:duration-300 max-sm:data-open:translate-x-0 max-sm:data-open:opacity-100 sm:col-start-1 sm:row-start-2"
  >
    {menuItems.map((menuItem) => (
      <a
        key={menuItem.link}
        href={menuItem.link}
        activeClassName="active"
        className="mb-2.5 inline-block text-right text-nav font-light text-primary-inverse uppercase no-underline hover:font-bold max-sm:my-6.25 max-sm:text-center max-sm:text-[25px]"
      >
        {menuItem.title}{" "}
        <Icon icon={menuItem.icon} fixedWidth className="ml-[0.3em]" />
      </a>
    ))}
  </ul>
);

export default Nav;
