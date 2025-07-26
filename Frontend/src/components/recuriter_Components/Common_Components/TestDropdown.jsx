/* eslint-disable react/prop-types */
import { ChevronDown } from "lucide-react";

const TestDropdown = ({ selectedTest, setSelectedTest, setSelectedView, dropdownOpen, setDropdownOpen }) => {
  const testOptions = [
    { value: "online", label: "Online Test" },
    { value: "behavioral", label: "Behavioural Test" },
    { value: "coding", label: "Coding Test" },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 flex items-center gap-2 min-w-[200px] justify-between hover:bg-gray-50 transition-colors shadow-sm"
      >
        <span>
          {testOptions.find((opt) => opt.value === selectedTest)?.label}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            dropdownOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {dropdownOpen && (
        <div className="absolute top-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-[200px]">
          {testOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                setSelectedTest(option.value);
                setDropdownOpen(false);
                setSelectedView("total");
              }}
              className="w-full text-left px-4 py-2 text-gray-900 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestDropdown;