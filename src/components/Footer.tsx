export default function Footer() {
  return (
    <footer className="w-full bg-footer-background shadow-sm mt-auto z-100">
      <div className="mx-auto px-4 py-4 flex justify-center items-center max-w-7xl">
        <p className="text-sm text-gray-600">
          © 2024 Entren - en tjänst av{" "}
          <a
            href="https://www.fasterforward.se/"
            className="text-footer-link hover:text-footer-link-hover"
          >
            Faster Forward
          </a>
        </p>
      </div>
    </footer>
  );
}
