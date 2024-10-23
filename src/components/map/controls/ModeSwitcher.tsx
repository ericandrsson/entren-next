import { Eye, PenTool } from "lucide-react";
import React from "react";

interface ModeSwitcherProps {
  currentMode: "view" | "contribute";
  onModeChange: (mode: "view" | "contribute") => void;
}

const ModeSwitcher: React.FC<ModeSwitcherProps> = ({ currentMode, onModeChange }) => {
  return (
    <div className="relative h-12 w-64 rounded-full bg-white p-2 shadow-inner">
      <div
        className={`absolute left-2 top-2 h-[calc(100%-16px)] w-[calc(50%-10px)] transform rounded-full bg-blue-500 transition-all duration-300 ${
          currentMode === "contribute" ? "translate-x-[calc(100%+4px)] bg-green-500" : ""
        }`}
      ></div>
      <button
        onClick={() => onModeChange("view")}
        className={`absolute left-2 top-2 z-10 flex h-[calc(100%-16px)] w-[calc(50%-8px)] items-center justify-center ${
          currentMode === "view" ? "text-white" : "text-gray-700"
        }`}
      >
        <Eye className="mr-2 h-4 w-4" />
        <span className="text-sm font-medium">Utforska</span>
      </button>
      <button
        onClick={() => onModeChange("contribute")}
        className={`absolute right-2 top-2 z-10 flex h-[calc(100%-16px)] w-[calc(50%-10px)] items-center justify-center ${
          currentMode === "contribute" ? "text-white" : "text-gray-700"
        }`}
      >
        <PenTool className="mr-2 h-4 w-4" />
        <span className="text-sm font-medium">Bidra</span>
      </button>
    </div>
  );
};

export default ModeSwitcher;
