export default function Footer() {
  return (
    <footer className="z-100 mt-auto w-full bg-background shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between px-4 py-4 sm:flex-row">
        <div className="mb-2 flex space-x-4 sm:mb-0">
          <a href="/integritet" className="hover:text-footer-link-hover text-sm text-foreground">
            Integritet
          </a>
          <a href="/cookies" className="hover:text-footer-link-hover text-sm text-foreground">
            Cookies
          </a>
          <a href="/villkor" className="hover:text-footer-link-hover text-sm text-foreground">
            Villkor
          </a>
        </div>
        <p className="text-center text-sm text-black sm:text-left">
          © 2024 Entrén - en tjänst av{" "}
          <a href="https://www.fasterforward.se/" className="hover:text-footer-link-hover text-primary">
            Faster Forward
          </a>
        </p>
      </div>
    </footer>
  );
}
