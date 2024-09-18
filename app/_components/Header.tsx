import Link from "next/link";

export function Header() {
  return (
    <header className="w-full bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-800">
          Entren
        </Link>
      </div>
    </header>
  );
}

// Create a separate file for ButtonLogin component
