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
    <div className="bg-white rounded-full shadow-md p-1 flex">
      <button
        onClick={() => onModeChange("view")}
        className={`flex items-center px-3 py-2 rounded-full transition-all duration-300 ${
          currentMode === "view"
            ? "bg-blue-500 text-white"
            : "bg-transparent text-gray-700 hover:bg-gray-100"
        }`}
      >
        <Eye className="w-4 h-4 mr-2" />
        <span className="text-sm font-medium">View</span>
      </button>
      <button
        onClick={() => onModeChange("contribute")}
        className={`flex items-center px-3 py-2 rounded-full transition-all duration-300 ${
          currentMode === "contribute"
            ? "bg-green-500 text-white"
            : "bg-transparent text-gray-700 hover:bg-gray-100"
        }`}
      >
        <PenTool className="w-4 h-4 mr-2" />
        <span className="text-sm font-medium">Contribute</span>
      </button>
    </div>
  );
};

export default ModeSwitcher;
