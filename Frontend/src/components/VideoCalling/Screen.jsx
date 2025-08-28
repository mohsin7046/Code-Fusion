import  { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaPhone, FaPaperPlane, FaEllipsisV,FaComment  } from 'react-icons/fa';
import { io } from 'socket.io-client';
import MonacoEditor from './MonacoEditor';
import Split from 'react-split';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const socket = io(import.meta.env.VITE_PORT);

const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ],
};

const Room = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(JSON.parse(localStorage.getItem('isMuted')) || false);
  const [isVideoOff, setIsVideoOff] = useState(JSON.parse(localStorage.getItem('isVideoOff')) || false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const localVideoRef = useRef();
  const [remoteStreams, setRemoteStreams] = useState(new Map());
  const peerConnections = useRef(new Map());
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const localStreamRef = useRef(null);
  const [userId, setUserId] = useState("");

  const [currentCode, setCurrentCode] = useState("");
  const [currentOutput, setCurrentOutput] = useState("");
  const [executionStatus, setExecutionStatus] = useState("");

    const location = useLocation();
  const formData = location.state;
  console.log("FormData",formData);

  const handleCodeChange = (code) => {
    setCurrentCode(code);
  };

  const handleOutputChange = (output, status) => {
    setCurrentOutput(output);
    setExecutionStatus(status);
  };


  const chat = useRef('');
  const name  = useRef('');

  const createPeerConnection = (userId, stream) => {
    const peerConnection = new RTCPeerConnection(configuration);
    peerConnections.current.set(userId, peerConnection);

    stream.getTracks().forEach(track => {
      peerConnection.addTrack(track, stream);
    });

    peerConnection.ontrack = (event) => {
      setRemoteStreams(prev => new Map(prev).set(userId, event.streams[0]));
    };

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', {
          candidate: event.candidate,
          to: userId,
          from: socket.id,
        });
      }
    };

    return peerConnection;
  };


  useEffect(() => {
    const startCall = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        toggleLocalStreamTracks();

        socket.on("connect", () => {
         setUserId(socket.id);
         });

        socket.emit('join-room', { roomId, userId: socket.id });

        socket.on('existing-users', async (existingUsers) => {
          for (const userId of existingUsers) {
            const peerConnection = createPeerConnection(userId, stream);
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            socket.emit('offer', { offer, to: userId, from: socket.id });
          }
        });

        socket.on('user-joined', ({ socketId }) => {
          createPeerConnection(socketId, stream);
        });

        socket.on('offer', async ({ offer, from }) => {
          let peerConnection = peerConnections.current.get(from);

          if (!peerConnection) {
            peerConnection = createPeerConnection(from, localStreamRef.current);
          }

          await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);
          socket.emit('answer', { answer, to: from, from: socket.id });
        });


        socket.on('answer', async ({ answer, from }) => {
          const peerConnection = peerConnections.current.get(from);
          if (peerConnection) {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
          }
        });


        socket.on('ice-candidate', async ({ candidate, from }) => {
          const peerConnection = peerConnections.current.get(from);
          if (peerConnection) {
            await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
          }
        });


        socket.on('user-left', ({ userId }) => {
          const peerConnection = peerConnections.current.get(userId);
          if (peerConnection) {
            peerConnection.close();
            peerConnections.current.delete(userId);
          }
          setRemoteStreams(prev => {
            const newStreams = new Map(prev);
            newStreams.delete(userId);
            return newStreams;
          });
        });
      } catch (err) {
        console.error('Error accessing media devices:', err);
      }
    };

    startCall();

    return () => {
      socket.emit('leave-room', { roomId, userId: socket.id });
      localStreamRef.current?.getTracks().forEach(track => track.stop());
      peerConnections.current.forEach(connection => connection.close());
    };
  }, [roomId]);


  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);
      localStorage.setItem('isMuted', JSON.stringify(!audioTrack.enabled));
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoOff(!videoTrack.enabled);
      localStorage.setItem('isVideoOff', JSON.stringify(!videoTrack.enabled));
    }
  };

  const toggleLocalStreamTracks = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      audioTrack.enabled = !isMuted;
      videoTrack.enabled = !isVideoOff;
    }
  };

  const endCall = async() => {

    if(!currentCode || !currentOutput){
      toast.error("Code or Output is missing!!")
    }

    socket.emit('leave-room', { roomId, userId: socket.id });
    localStreamRef.current?.getTracks().forEach(track => track.stop());
    peerConnections.current.forEach(connection => connection.close());
    
    navigate('/feedback',{state:{currentOutput,currentCode,jobId:formData.jobId,candidateId:formData?.email}});
  };

  const handleSendMessage = () => {
    name.current = document.getElementById('chatname').textContent;
    chat.current = document.getElementById('chats').value;
    if (chat.current !== '') {
      const newMessage = { user: name.current, message: chat.current };
      setChatMessages(prevMessages => [...prevMessages, newMessage]);
      socket.emit('send-message', { roomId, message: newMessage });
      document.getElementById('chats').value = '';
    }
  };

  useEffect(() => {
    socket.on('receive-message', (message) => {
      setChatMessages(prevMessages => prevMessages.some(msg => msg.message === message.message) ? prevMessages : [...prevMessages, message]);
    });
  }, []);


  const getLayoutClasses = () => {
    const totalParticipants = 1 + remoteStreams.size;
    
    if (totalParticipants === 1) {
      return "w-full h-full flex items-center justify-center p-2";
    } else {
      return "w-full h-full grid grid-cols-2 gap-3 p-2 auto-rows-min content-start";
    }
  };

  
  const getVideoContainerClasses = () => {
    const totalParticipants = 1 + remoteStreams.size;
    const baseClasses = "relative bg-black rounded-lg overflow-hidden";
    
    if (totalParticipants === 1) {
      return `${baseClasses} w-full max-w-3xl aspect-video`;
    } else {
      const sizeClasses = isEditorOpen || isChatOpen 
        ? "w-full min-w-[280px]" 
        : "w-full min-w-[400px]";
      return `${baseClasses} ${sizeClasses} aspect-video`;
    }
  };

  const getVideoClasses = () => {
    return "w-full h-full object-cover";
  };

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
    <div className="flex flex-1 overflow-hidden">
      {!isEditorOpen ? (
       
        <div className="flex flex-1">
          
          <div className={`flex flex-1 ${isChatOpen ? 'w-full md:w-[calc(100%-300px)]' : 'w-full'}`}>
            <div className="w-full h-full overflow-y-auto">
              <div className={getLayoutClasses()}>
                
                <div className={getVideoContainerClasses()}>
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className={getVideoClasses()}
                  />
                  <div className="absolute bottom-2 left-2 text-white bg-gray-800/80 px-2 py-1 rounded text-sm">
                    HOST
                  </div>
                </div>

                
                {Array.from(remoteStreams).map(([userId, stream], index) => (
                  <div key={userId} className={getVideoContainerClasses()}>
                    <video
                      autoPlay
                      playsInline
                      className={getVideoClasses()}
                      ref={el => {
                        if (el) el.srcObject = stream;
                      }}
                    />
                    <div className="absolute bottom-2 left-2 text-white bg-gray-800/80 px-2 py-1 rounded text-sm" id='chatname'>
                      {`Participant ${index + 1}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ): (
        
        <Split 
          className="flex flex-1"
          sizes={[60, 40]}
          minSize={[600, 100]}
          expandToMin={false}
          gutterSize={10}
          gutterAlign="center"
          snapOffset={30}
          dragInterval={1}
          direction="horizontal"
          cursor="col-resize"
        >
          
          <div className="h-full overflow-hidden">
             <div className="w-full h-full overflow-y-auto">
              <div className={getLayoutClasses()}>
                
                <div className={getVideoContainerClasses()}>
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className={getVideoClasses()}
                  />
                  <div className="absolute bottom-2 left-2 text-white bg-gray-800/80 px-2 py-1 rounded text-sm">
                    HOST
                  </div>
                </div>

                
                {Array.from(remoteStreams).map(([userId, stream], index) => (
                  <div key={userId} className={getVideoContainerClasses()}>
                    <video
                      autoPlay
                      playsInline
                      className={getVideoClasses()}
                      ref={el => {
                        if (el) el.srcObject = stream;
                      }}
                    />
                    <div className="absolute bottom-2 left-2 text-white bg-gray-800/80 px-2 py-1 rounded text-sm" id='chatname'>
                      {`Participant ${index + 1}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          
          <div className="h-full overflow-hidden border-l border-gray-700">
           <MonacoEditor 
                roomId={roomId} 
                userId={userId} 
                jobId={formData?.jobId}
                onCodeChange={handleCodeChange}
                onOutputChange={handleOutputChange}
              />
          </div>
        </Split>
      )}

      
      {isChatOpen && (
        <div className="bg-gray-800 overflow-y-auto flex flex-col border-l border-gray-700 w-[300px]">
          <div className="p-4 flex-1 flex flex-col min-h-0">
            <h2 className="text-white mb-4 text-lg font-semibold">Chat</h2>
            <div className="flex-1 space-y-3 overflow-y-auto">
              {chatMessages.map((chat, index) => (
                <div key={index} className="text-white text-sm bg-gray-700/50 p-2 rounded-lg">
                  <strong className="text-blue-400">{chat.user}: </strong>{chat.message}
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                id="chats"
                 name="chats"
                placeholder="Type a message..."
                className="flex-1 p-2 text-sm rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSendMessage}
                className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <FaPaperPlane className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

    
    <div className="bg-gray-800 p-4 flex justify-center items-center border-t border-gray-700">
      <div className="flex flex-wrap justify-center gap-4 md:gap-6">
        <button
          onClick={toggleAudio}
          className={`p-3 md:p-4 rounded-full ${isMuted ? 'bg-red-500' : 'bg-gray-600'} hover:bg-opacity-80 transition-colors transform hover:scale-105`}
        >
          {isMuted ? <FaMicrophoneSlash className="text-white w-4 h-4 md:w-5 md:h-5" /> : <FaMicrophone className="text-white w-4 h-4 md:w-5 md:h-5" />}
        </button>

        <button
          onClick={toggleVideo}
          className={`p-3 md:p-4 rounded-full ${isVideoOff ? 'bg-red-500' : 'bg-gray-600'} hover:bg-opacity-80 transition-colors transform hover:scale-105`}
        >
          {isVideoOff ? <FaVideoSlash className="text-white w-4 h-4 md:w-5 md:h-5" /> : <FaVideo className="text-white w-4 h-4 md:w-5 md:h-5" />}
        </button>

        <button
          onClick={endCall}
          className="p-3 md:p-4 rounded-full bg-red-500 hover:bg-red-600 transition-colors transform hover:scale-105"
        >
          <FaPhone className="text-white w-4 h-4 md:w-5 md:h-5 transform rotate-225" />
        </button>

        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`p-3 md:p-4 rounded-full ${isChatOpen ? 'bg-blue-600' : 'bg-gray-600'} hover:bg-opacity-80 transition-colors transform hover:scale-105`}
        >
          <FaComment className="text-white w-4 h-4 md:w-5 md:h-5" />
        </button>

        <button
          onClick={() => setIsEditorOpen(!isEditorOpen)}
          className={`p-3 md:p-4 rounded-full ${isEditorOpen ? 'bg-blue-600' : 'bg-gray-600'} hover:bg-opacity-80 transition-colors transform hover:scale-105`}
        >
          <FaEllipsisV className="text-white w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>
    </div>
  </div>
);
};

export default Room;