import viteLogo from "/vite.svg";
import tailwindcssLogo from "/tailwindcss.svg";
import reactLogo from "../assets/react.svg";

const pagePath = window.location.pathname.replace(/\//g, "");

const Header = () => {
  return (
    <>
      <div className="align-center container mx-auto mt-12 justify-center p-2">
        <header className="flex justify-center p-2">
          <nav>
            <a href="/" className={`mr-5 ${pagePath === "" ? "active" : ""}`}>
              Root
            </a>
            <a
              href="/routea/"
              className={`mr-5 ${pagePath === "routea" ? "active" : ""}`}
            >
              Route A
            </a>
            <a
              href="/routeb/"
              className={`mr-5 ${pagePath === "routeb" ? "active" : ""}`}
            >
              Route B
            </a>
            <a
              href="/routec/"
              className={`${pagePath === "routec" ? "active" : ""}`}
            >
              Route C
            </a>
          </nav>
        </header>
        <div className="container mx-auto flex items-center justify-center p-2 ">
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
