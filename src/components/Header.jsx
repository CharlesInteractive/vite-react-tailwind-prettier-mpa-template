// Shared navigation + logo bar rendered at the top of every page. Because this is
// an MPA (each page is a full document load), the "active" link is decided from
// the current path — there is no client-side router.
import viteLogo from "/vite.svg";
import tailwindcssLogo from "/tailwindcss.svg";
import reactLogo from "../assets/react.svg";
import { navLinks } from "./navLinks";
import { usePathname } from "./pathname";

const Header = () => {
  // Active-link matching: compare the first path segment of the current URL against
  // each link's `match`. Using only the first segment means nested paths like
  // /routea/sub still highlight "Route A" correctly.
  // usePathname() works under the prerender too, where `window` does not exist.
  const currentSegment = usePathname().split("/").filter(Boolean)[0] ?? "";

  return (
    <>
      <div className="align-center container mx-auto mt-12 justify-center p-2">
        <header className="flex justify-center p-2">
          <nav>
            {navLinks.map(({ href, label, match }, index) => (
              <a
                key={href}
                href={href}
                className={`${index < navLinks.length - 1 ? "mr-5 " : ""}${
                  currentSegment === match ? "active" : ""
                }`}
              >
                {label}
              </a>
            ))}
          </nav>
        </header>
        <div className="container mx-auto flex items-center justify-center p-2">
          <a
            href="https://vitejs.dev"
            className="mr-5 block w-24"
            target="_blank"
            rel="noreferrer"
          >
            <img src={viteLogo} className="w-full" alt="Vite logo" />
          </a>
          <a
            href="https://react.dev"
            className="mr-5 block w-24"
            target="_blank"
            rel="noreferrer"
          >
            <img src={reactLogo} className="w-full" alt="React logo" />
          </a>
          <a
            href="https://tailwindcss.com/"
            className="block w-24"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src={tailwindcssLogo}
              className="w-full"
              alt="Tailwindcss logo"
            />
          </a>
        </div>
      </div>
    </>
  );
};
export default Header;
