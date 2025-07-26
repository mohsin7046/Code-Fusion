const ViewButtons = ({ selectedView, setSelectedView }) => {
  return (
    <div className="flex gap-4 mb-6">
      <button
        onClick={() => setSelectedView("total")}
        className={`px-4 py-2 rounded-lg border transition-colors ${
          selectedView === "total"
            ? "bg-gray-100 border-gray-300 text-gray-900"
            : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
        }`}
      >
        Total applicants
      </button>
      <button
        onClick={() => setSelectedView("shortlisted")}
        className={`px-4 py-2 rounded-lg border transition-colors ${
          selectedView === "shortlisted"
            ? "bg-gray-100 border-gray-300 text-gray-900"
            : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
        }`}
      >
        Shortlisted applicant
      </button>
      <button
        onClick={() => setSelectedView("feedback")}
        className={`px-4 py-2 rounded-lg border transition-colors ${
          selectedView === "feedback"
            ? "bg-gray-100 border-gray-300 text-gray-900"
            : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
        }`}
      >
        Feedback
      </button>
    </div>
  );
};

export default ViewButtons;