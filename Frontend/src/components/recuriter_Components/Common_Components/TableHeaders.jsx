/* eslint-disable react/prop-types */
const TableHeaders = ({ selectedView, selectedTest }) => {
  const renderTableHeaders = () => {
    if (selectedView === "total") {
      if (selectedTest === "online") {
        return (
          <tr className="border border-gray-300">
            <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
              ID
            </th>
            <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
              Name
            </th>
            <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
              Email
            </th>
            <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
              Score
            </th>
            <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
              Status
            </th>
            <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
              Applied Date
            </th>
             <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
                Add to Shortlist
            </th>
            <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
              Action
            </th>
           
          </tr>
        );
      } else if (selectedTest === "behavioral") {
        return (
          <tr className="border border-gray-300">
            <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
              ID
            </th>
            <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
              Name
            </th>
            <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
              Email
            </th>
            <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
              Score
            </th>
            <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
              Status
            </th>
            <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
              Date
            </th>
            <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
                Add to Shortlist
            </th>
            <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
              Action
            </th>
          </tr>
        );
      } else {
        return (
          <tr className="border border-gray-300">
            <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
              ID
            </th>
            <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
              Name
            </th>
            <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
              Email
            </th>
            <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
              Status
            </th>
            <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
              Date
            </th>
            <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
              Add to Shortlist
            </th>
            <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
              Action
            </th>
          </tr>
        );
      }
    } else if (selectedView === "shortlisted") {
      return (
        <tr className="border border-gray-300">
          <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
            ID
          </th>
          <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
            Name
          </th>
          <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
            Email
          </th>
          <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
            Score
          </th>
          <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
            Status
          </th>
          <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
            Passing Score
          </th>
          <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
              Reject
          </th>
          <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
            Action
          </th>
        </tr>
      );
    } else {
      return (
        <tr className="border border-gray-300">
          <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
            ID
          </th>
          <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
            Name
          </th>
          <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
            Score
          </th>
          <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
            Strengths
          </th>
          <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
            Weaknesses
          </th>
          <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
            Recommendations
          </th>
          {/* <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
              Reject
          </th> */}
          <th className="px-4 py-3 text-left text-gray-700 bg-gray-100 font-medium">
            Action
          </th>
        </tr>
      );
    }
  };

  return (
    <thead>{renderTableHeaders()}</thead>
  );
};

export default TableHeaders;