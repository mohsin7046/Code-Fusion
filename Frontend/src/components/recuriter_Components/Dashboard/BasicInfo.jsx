/* eslint-disable react/prop-types */
function BasicInfo(props) {
  return (
    <div className="flex flex-col h-auto w-full text-black bg-white border rounded-lg shadow-lg p-6">
      <h1 className="font-semibold text-3xl text-gray-800 mb-8">
        Basic Information about Interview
      </h1>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="company">
              Company Name
            </label>
            <input
              type="text"
              id="company"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="role">
              Interview Role
            </label>
            <input
              type="text"
              id="role"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
      
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="date">
              Date
            </label>
            <input
              type="date"
              id="date"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <label className="block text-gray-700 font-medium mb-1" htmlFor="date">
              Time
            </label>
            <input
              type="time"
              id="time"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-1" htmlFor="desc">
              Description
            </label>
            <textarea
              id="desc"
              rows="4"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            ></textarea>
          </div>
        </div>
        <div className="mt-8 flex justify-end w-full">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200" onClick={props.Next}>
                Next ▶️
            </button>
        </div>
    </div>
  );
}

export default BasicInfo;
