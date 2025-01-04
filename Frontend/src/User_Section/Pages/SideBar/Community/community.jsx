import React, { useState } from 'react';

const CommunitySidebar = ({ channels, selectedChannelId, onChannelSelect, onAddChannel }) => {
  const [newChannelName, setNewChannelName] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleAddChannel = () => {
    if (newChannelName.trim()) {
      onAddChannel(newChannelName.trim());
      setNewChannelName('');
    }
  };

  return (
    <div className="relative">
      
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="sm:hidden p-4 text-gray-400 hover:text-white fixed top-2 left-2 z-50 bg-gray-800 rounded-full"
      >
        {isSidebarOpen ? '✖' : '☰'}
      </button>

     
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-gray-900 text-white transition-transform duration-300 z-40 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } sm:translate-x-0 sm:relative sm:w-64`}
      >
        <div className="flex justify-between items-center mb-6 p-4">
          <h2 className="text-2xl font-bold">Communities</h2>
        </div>

        <div className="space-y-4 px-4">
          {channels.map((channel) => (
            <div
              key={channel.id}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                selectedChannelId === channel.id ? 'bg-gray-700' : 'hover:bg-gray-800'
              }`}
              onClick={() => onChannelSelect(channel.id)}
            >
              <div className="flex items-center justify-center w-10 h-10 bg-yellow-500 text-black font-bold rounded-full">
                {channel.name[0].toUpperCase()}
              </div>
              <span className="text-lg">{channel.name}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 px-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newChannelName}
              onChange={(e) => setNewChannelName(e.target.value)}
              placeholder="Add channel"
              className="flex-grow bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none"
            />
            <button
              onClick={handleAddChannel}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition"
            >
              Add
            </button>
          </div>
        </div>
      </div>

     
      {isSidebarOpen && (
        <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black bg-opacity-50 z-30 sm:hidden"></div>
      )}
    </div>
  );
};

export default CommunitySidebar;
