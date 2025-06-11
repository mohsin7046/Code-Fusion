import  { useState } from 'react';
import { ChannelContext } from './UseContext';

// eslint-disable-next-line react/prop-types
const ChannelProvider = ({ children }) => {
  const [channels, setChannels] = useState([
    { id: '1', name: 'General' },
    { id: '2', name: 'Announcements' },
  ]);
  const [selectedChannelId, setSelectedChannelId] = useState(null);

  const addChannel = (name) => {
    const newChannel = { id: `${channels.length + 1}`, name };
    setChannels([...channels, newChannel]);
  };

  const selectChannel = (id) => {
    setSelectedChannelId(id);
  };

  const selectedChannel = channels.find((channel) => channel.id === selectedChannelId) || null;

  return (
    <ChannelContext.Provider value={{
      channels,
      selectedChannelId,
      addChannel,
      selectChannel,
      selectedChannel,
    }}>
      {children}
    </ChannelContext.Provider>
  );
};

export { ChannelProvider };
