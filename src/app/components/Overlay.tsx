// components/Overlay.tsx
import React from "react";
import Link from "next/link";

interface OverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const Overlay: React.FC<OverlayProps> = ({ isOpen, onClose }) => {
  return (
    <div
      className={`fixed top-0 left-0 h-full w-[300px] md:w-[500px] bg-gray-600 text-white z-50 transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Close Button */}
      <div className="flex justify-start p-2">
        <button onClick={onClose} className="text-5xl hover:text-gray-400">
          &times;
        </button>
      </div>

      {/* Content */}
      <div className="px-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Genres</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border border-gray-700 p-3 rounded-md">
            {["Action", "Drama", "Romance", "Animated", "Horror", "More"].map(
              (genre) => (
                <button
                  key={genre}
                  className="bg-gray-800 hover:bg-gray-700 text-md py-2 px-3 rounded"
                >
                  {genre}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overlay;
