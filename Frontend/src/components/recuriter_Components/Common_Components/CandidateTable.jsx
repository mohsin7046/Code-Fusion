/* eslint-disable react/prop-types */
import TableHeaders from './TableHeaders.jsx';
import TableRows from './TableRows.jsx';

const CandidateTable = ({ 
  selectedTest, 
  selectedView, 
  getCurrentData, 
  getStatusColor, 
  getShortlistCondition, 
  getFeedbackData, 
  setShortlistItem, 
  handleOnlineShortlist, 
  handleBehaviouralShortlist, 
  setSelectedCandidate, 
  setShowDetailedOverview, 
  handleDecline, 
  onlinedata, 
  behaviouraldata, 
  handleAcceptAll 
}) => {
  const testData = {
    online: { name: "Online Test" },
    behavioral: { name: "Behavioural Test" },
    coding: { name: "Coding Test" },
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <h3 className="text-gray-900 font-medium mb-4">Table</h3>
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg overflow-hidden">
          <TableHeaders selectedView={selectedView} selectedTest={selectedTest} />
          <TableRows 
            getCurrentData={getCurrentData}
            selectedTest={selectedTest}
            selectedView={selectedView}
            getStatusColor={getStatusColor}
            getShortlistCondition={getShortlistCondition}
            getFeedbackData={getFeedbackData}
            setShortlistItem={setShortlistItem}
            handleOnlineShortlist={handleOnlineShortlist}
            handleBehaviouralShortlist={handleBehaviouralShortlist}
            setSelectedCandidate={setSelectedCandidate}
            setShowDetailedOverview={setShowDetailedOverview}
            handleDecline={handleDecline}
            onlinedata={onlinedata}
            behaviouraldata={behaviouraldata}
          />
        </table>
      </div>
      {selectedView === "shortlisted" && (
        <div className="mt-4 flex justify-end gap-2">
          <button 
            className="bg-black hover:bg-black text-white px-3 py-2 rounded-lg transition-colors shadow-xl" 
            onClick={() => handleAcceptAll(selectedTest)}
          >
            Accept All
          </button>
        </div>
      )}
    </div>
  );
};

export default CandidateTable;