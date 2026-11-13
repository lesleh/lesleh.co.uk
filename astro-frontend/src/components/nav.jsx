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

// Astro serves every page with a trailing slash, so the paths compare as they are.
const isCurrent = (link, currentPath) =>
  link === (currentPath.endsWith("/") ? currentPath : `${currentPath}/`);

// On a small screen the closed menu is invisible, which also takes its links
// out of the tab order. Visibility changes at once on open and after the slide on close.
const Nav = ({ currentPath = "" }) => (
  <nav
    id="site-nav"
    aria-label="Main"
    className="max-sm:invisible max-sm:fixed max-sm:inset-0 max-sm:z-2 max-sm:-translate-x-full max-sm:bg-primary max-sm:pt-12.5 max-sm:opacity-0 max-sm:[transition:translate_300ms,opacity_300ms,visibility_0s_300ms] max-sm:data-open:visible max-sm:data-open:[transition:translate_300ms,opacity_300ms,visibility_0s] max-sm:data-open:translate-x-0 max-sm:data-open:opacity-100 sm:col-start-1 sm:row-start-2"
  >
    <ul className="flex flex-col items-end max-sm:items-center">
      {menuItems.map((menuItem) => (
        <li key={menuItem.link} className="mb-2.5 max-sm:my-6.25">
          <a
            href={menuItem.link}
            aria-current={
              isCurrent(menuItem.link, currentPath) ? "page" : undefined
            }
            className="inline-block text-right text-nav font-light text-primary-inverse uppercase no-underline hover:font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-inverse aria-[current=page]:font-bold aria-[current=page]:underline aria-[current=page]:underline-offset-4 max-sm:text-center max-sm:text-[25px]"
          >
            {menuItem.title}{" "}
            <Icon icon={menuItem.icon} fixedWidth className="ml-[0.3em]" />
          </a>
        </li>
      ))}
    </ul>
  </nav>
);

export default Nav;
