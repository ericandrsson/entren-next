export default function Footer() {
  return (
    <footer className="w-full bg-background shadow-sm mt-auto z-100">
      <div className="mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center max-w-7xl">
        <div className="flex space-x-4 mb-2 sm:mb-0">
          <a
            href="/integritet"
            className="text-sm text-foreground hover:text-footer-link-hover"
          >
            Integritet
          </a>
          <a
            href="/cookies"
            className="text-sm text-foreground hover:text-footer-link-hover"
          >
            Cookies
          </a>
          <a
            href="/villkor"
            className="text-sm text-foreground hover:text-footer-link-hover"
          >
            Villkor
          </a>
        </div>
        <p className="text-sm text-black text-center sm:text-left">
          © 2024 Entrén - en tjänst av{" "}
          <a
            href="https://www.fasterforward.se/"
            className="text-primary hover:text-footer-link-hover"
          >
            Faster Forward
          </a>
        </p>
      </div>
    </footer>
  );
}
