/* eslint-disable react/prop-types */

const ChannelDetails = ({ selectedChannel }) => {
  if (!selectedChannel) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Select a channel to view details
      </div>
    );
  }
  return (
    <div className="flex flex-col h-full p-6 bg-gray-900 text-white rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{selectedChannel.name}</h2>
        <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition-all">
          Settings
        </button>
      </div>

      <div className="w-full h-48 bg-gray-700 rounded mb-6 flex items-center justify-center">
        <span className="text-gray-400">Channel Banner</span>
      </div>

      <div className="flex mb-4 space-x-4">
        <button className="text-sm font-medium text-white border-b-2 border-blue-500 pb-1">
          Posts
        </button>
        <button className="text-sm font-medium text-gray-400 hover:text-white">
          Files
        </button>
        <button className="text-sm font-medium text-gray-400 hover:text-white">
          Photos
        </button>
      </div>

      <div className="flex-grow bg-gray-800 p-4 rounded overflow-y-auto">
        <p className="text-gray-300">
          Details about the <strong>{selectedChannel.name}</strong> channel go
          here.
        </p>
      </div>

      <div className="flex space-x-4 mt-6">
        <button className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-all flex-grow">
          Invite People
        </button>
        <button className="flex items-center justify-center bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded transition-all flex-grow">
          Create Welcome Message
        </button>
        <button className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-all flex-grow">
          Create Event
        </button>
      </div>
    </div>
  );
};

export default ChannelDetails;
