import { useEffect, useRef, useState } from "preact/hooks";
import Icon from "./icon";
import { faBars } from "@fortawesome/free-solid-svg-icons";

const NAV_ID = "site-nav";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-inverse";

const Header = () => {
  const [open, setOpen] = useState(false);
  const button = useRef(null);

  useEffect(() => {
    const menu = document.getElementById(NAV_ID);
    if (!menu) return undefined;

    menu.toggleAttribute("data-open", open);
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };

    // The open menu covers the page, so it closes when focus moves behind it.
    const handleFocusIn = (event) => {
      if (
        !menu.contains(event.target) &&
        !button.current?.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("focusin", handleFocusIn);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("focusin", handleFocusIn);
    };
  }, [open]);

  return (
    <header className="text-center sm:col-start-1 sm:row-start-1 sm:text-end">
      <p className="text-title font-light">
        <a
          href="/"
          className={`text-primary-inverse no-underline ${focusRing}`}
        >
          <span className="font-semibold">Lesleh</span>
          .co.uk
        </a>
      </p>
      <button
        ref={button}
        type="button"
        className={`absolute top-0.5 right-0.5 z-5 cursor-pointer border-0 bg-transparent px-3.75 py-2.5 text-[24px] text-primary-inverse sm:hidden ${focusRing}`}
        aria-label="Main menu"
        aria-expanded={open ? "true" : "false"}
        aria-controls={NAV_ID}
        onClick={() => setOpen((value) => !value)}
      >
        <Icon icon={faBars} fixedWidth />
      </button>
    </header>
  );
};

export default Header;
