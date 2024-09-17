import React from "react";
import { Eye, PenTool } from "lucide-react";

interface ModeSwitcherProps {
  currentMode: "view" | "contribute";
  onModeChange: (mode: "view" | "contribute") => void;
}

const ModeSwitcher: React.FC<ModeSwitcherProps> = ({
  currentMode,
  onModeChange,
}) => {
  return (
    <div className="relative w-64 h-12 bg-white rounded-full shadow-inner p-2">
      <div
        className={`absolute top-2 left-2 w-[calc(50%-10px)] h-[calc(100%-16px)] bg-blue-500 rounded-full transition-all duration-300 transform ${
          currentMode === "contribute"
            ? "translate-x-[calc(100%+4px)] bg-green-500"
            : ""
        }`}
      ></div>
      <button
        onClick={() => onModeChange("view")}
        className={`absolute top-2 left-2 w-[calc(50%-8px)] h-[calc(100%-16px)] flex items-center justify-center z-10 ${
          currentMode === "view" ? "text-white" : "text-gray-700"
        }`}
      >
        <Eye className="w-4 h-4 mr-2" />
        <span className="text-sm font-medium">Utforska</span>
      </button>
      <button
        onClick={() => onModeChange("contribute")}
        className={`absolute top-2 right-2 w-[calc(50%-10px)] h-[calc(100%-16px)] flex items-center justify-center z-10 ${
          currentMode === "contribute" ? "text-white" : "text-gray-700"
        }`}
      >
        <PenTool className="w-4 h-4 mr-2" />
        <span className="text-sm font-medium">Bidra</span>
      </button>
    </div>
  );
};

export default ModeSwitcher;
