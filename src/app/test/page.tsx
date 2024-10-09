'use client'

import { useHeader } from "@/src/contexts/HeaderContext";
import { useEffect } from "react";

export default function TestPage() {
  const { setIsSticky } = useHeader();

  useEffect(() => {
    setIsSticky(false); // Set to false to make the header non-sticky on this page
    return () => setIsSticky(true); // Reset to true when leaving the page
  }, [setIsSticky]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Test Page</h1>
      <p className="mb-4">This is a test page to demonstrate the layout.</p>
      {/* Add more content to test scrolling */}
      {Array.from({ length: 20 }).map((_, index) => (
        <p key={index} className="mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      ))}
    </div>
  );
}
