import  { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Video, VideoOff, MessageCircle, User, Bot} from 'lucide-react';
import Vapi from '@vapi-ai/web'
// import Detecting from '../OnlineTest_Screen/Detecting'
import { useLocation, useNavigate } from 'react-router-dom';


const QuesAnsPrepApp = () => {
  const [vapi, setVapi] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [currentSpeaker, setCurrentSpeaker] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [sessionTime, setSessionTime] = useState(0);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [callObject, setCallObject] = useState(null);
  const [interviewQuestions, setInterviewQuestions] = useState("");
  const [timer, setTimer] = useState(null);
  const [durationInSec, setDurationInSec] = useState(0);
  const [storeQuestions, setStoreQuestions] = useState([]);

const location = useLocation();
const navigateData = location.state;

console.log(navigateData);


  const [formData,setFormData] = useState({
    aiInterviewResponseId: "",
    behavioralInterviewId:"",
    questions:"",
    keywords: null,
    evaluationCriteria: "",
    transcript: null,
    passingScore : 0
  });
  const videoRef = useRef(null);
  const timerRef = useRef(null);
  const conversationRef = useRef(null);

  const navigate = useNavigate();

  const apiKey = import.meta.env.VITE_VAPI_API_KEY || '';
  const aiMessageBuffer = useRef('');
  const userMessageBuffer = useRef('');
  const aiDebounceTimer = useRef(null);
  const userDebounceTimer = useRef(null);

  
  useEffect(()=> {
    const getBehaviourQuestions = async () => {
      const res = await fetch('/api/user/behaviouraltest/getbehaviorTestQuestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ jobId: navigateData?.JobId }) 
      })

      const data = await res.json();

      console.log(data);

      const minutes = data.data.duration;
      const seconds = minutes * 60;
      setTimer(seconds);
      setDurationInSec(seconds);
      
      setFormData(prev =>({
        ...prev,
        questions: data.data.questions.map(q => q.question).join(', '),
        behavioralInterviewId:data.data.id,
        keywords: data.data.keyWords,
        evaluationCriteria: data.data.evaluationCriteria,
        passingScore : data.data.passingScore
      }))

      if (data.success) {
        const temp = data.data.questions.map(q => q.question).join(', ');
        setInterviewQuestions(temp);
        setStoreQuestions(data.data.questions);
      } else {
        console.error('Failed to fetch questions:', data.message);
      }
    }
    getBehaviourQuestions();
  },[])

  
  const assistantConfig = {
      name: "AI BEHAVIOUR TEST ",
      firstMessage: "Hi Mohsinali how are you? Ready for your interview on Devops",
      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "en-US",
      },
      voice: {
        provider: "playht",
        voiceId: "jennifer",
      },
      model: {
        provider: "openai",
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are an AI voice assistant acting as a technical interviewer for a Full Stack React developer role.

🧠 Your responsibility is to ask a predefined list of interview questions related to React and Full Stack development. Assess the candidate’s responses in a professional and engaging manner.

🎙 Conversation Flow:
- Start with a friendly intro. Example: 
  "Hey there! Welcome to your FullStack interview. Let’s get started with a few questions!"
- Ask each question from the list below — one at a time.
- ✅ Ask a question only once. Even if the candidate gives a wrong answer, do not rephrase, repeat, or give hints. Move to the next question.
- Provide short, natural feedback after each answer:
  - Positive: “Nice! That’s a solid answer.”
  - Negative: “Thanks for your response.”

❗ Rules:
1. ❌ If the candidate asks unrelated/off-topic questions (e.g., about other tech, life, random chat), respond:  
   “Let’s stay focused on the interview for now. Please answer the current question.”
2. ⚠ If the candidate tries to skip a question, politely warn:  
   “Skipping questions is discouraged. Please give your best attempt.”
3. 🎯 Never answer questions yourself, even if asked.
4. Keep the interview concise and professional.

📋 Questions to ask:
${interviewQuestions}

✅ Wrap up after all questions with a short summary:  
"That was great! You handled some tough questions well. Keep sharpening your skills!"

📤 End with a polite goodbye:
"Thanks for chatting! Hope to see you crushing projects soon!"

🔈 *Speaking Style (important):*
Use a slower speaking pace for better clarity. Wrap your spoken responses using SSML:
html
<speak><prosody rate="slow">Your response text here...</prosody></speak>
`
        .trim(),
          },
        ],
      },
    };

  // Initialize Vapi
  useEffect(() => {
    const initVapi = async () => {
      try {
        
        const vapiInstance = new Vapi(apiKey);
        setVapi(vapiInstance);


        vapiInstance.on('call-start', () => {
          console.log('Call started');
          setIsConnected(true);
          setIsLoading(false);
          addMessage('system', 'Interview session started', 'system');
        });

        vapiInstance.on('call-end', () => {
          console.log('Call ended');
          setIsConnected(false);
          setCurrentSpeaker(null);
          setIsLoading(false);
          addMessage('system', 'Interview session ended', 'system');
        });

        vapiInstance.on('speech-start', () => {
          console.log('AI started speaking');
          setCurrentSpeaker('ai');
        });

        vapiInstance.on('speech-end', () => {
          console.log('AI finished speaking');
          setCurrentSpeaker(null);
        });

        vapiInstance.on('volume-level', (level) => {
          setVolumeLevel(level);
        });

     vapiInstance.on('message', (message) => {
       console.log('Message received:', message);

  if (message.type === 'transcript' && message.transcriptType === 'final') {
    const buffer = message.role === 'assistant' ? aiMessageBuffer : userMessageBuffer;
    const timer = message.role === 'assistant' ? aiDebounceTimer : userDebounceTimer;

    buffer.current += (buffer.current ? ' ' : '') + message.transcript;

    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      if (buffer.current.trim()) {
        addMessage(
          message.role === 'assistant' ? 'ai' : 'user',
          buffer.current.trim(),
          message.role === 'assistant' ? 'question' : 'answer'
        );
        buffer.current = '';
      }
    }, 3000); 
  }
});

 vapiInstance.on('error', (error) => {
  console.error('Vapi error:', error);
  if (error?.error?.type === 'ejected') {
    addMessage('system', 'Call ended: ' + error.error.msg, 'error');
    setIsConnected(false);
    setCurrentSpeaker(null);
    setIsLoading(false);
    endCall(); 
  } else {
    addMessage('system', `Error: ${error.message}`, 'error');
    setIsLoading(false);
  }
});


      } catch (error) {
        console.error('Failed to initialize Vapi:', error);
        addMessage('system', 'Failed to initialize voice assistant. Please check your API key.', 'error');
      }
    };

    if (apiKey) {
      initVapi();
    }
  }, [apiKey]);


  // Session timer
  useEffect(() => {
    if (isConnected) {
      timerRef.current = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      setSessionTime(0);
    }
    return () => clearInterval(timerRef.current);
  }, [isConnected]);

  // timer change 

   useEffect(() => {
    if (timer === null ) return;
    if (timer === 0) {
      handleSubmit();
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);


  // Auto-scroll conversation
  useEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [conversation]);



  // Helper functions
  const formatTime = (seconds=3600) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };


  const addMessage = (speaker, message, type = 'message') => {
    const newMessage = {
      id: Date.now() + Math.random(),
      speaker,
      message,
      timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      type
    };
    setConversation(prev => [...prev, newMessage]);
  };



  const startCall = async () => {
    if (!vapi) {
      addMessage('system', 'Please enter your Vapi API key first', 'error');
      return;
    }

    setIsLoading(true);
    
    try {
      let callParams;

      console.log(assistantConfig);
    
      if (assistantConfig) {
        callParams = assistantConfig;
      } 

      const call = await vapi.start(callParams);
      setCallObject(call);
      
    } catch (error) {
      console.error('Failed to start call:', error);
      setIsLoading(false);
      addMessage('system', `Failed to start interview: ${error.message}`, 'error');
    }
  };

  const handleSubmit = async (formattedConversation) => {
    try {
      if( !formattedConversation || formattedConversation.length === 0) {
        addMessage('system', 'No conversation data to submit', 'error');
        return;
      }
      
      const res = await fetch('/api/user/behaviouraltest/getBehaviorTestResponse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          transcript: formattedConversation,
          email:navigateData?.email,
          behavioralInterviewId: formData.behavioralInterviewId,
          jobId: navigateData?.JobId,
          name: navigateData?.name,
          timeTaken  : durationInSec - timer
        })
      })
      
      const data = await res.json();

      if(!res.ok){
        console.log("Error taking data");
        return;
      }
           
      console.log(data);
      
      
       const updatedFormData = {
      aiInterviewResponseId: data.id,
      behavioralInterviewId:formData.behavioralInterviewId,
      transcript: formattedConversation, 
      questions: formData.questions,
      keywords: formData.keywords, 
      evaluationCriteria: formData.evaluationCriteria,
      passingScore: formData.passingScore,
    };

    console.log("Update ",updatedFormData);
    

      setFormData(updatedFormData);


    
      if (data.success) {
        alert('Interview responses submitted successfully');
      }
      else {
        console.error('Failed to submit responses:', data.message);
        alert( `Failed to submit responses: ${data.message}`);
      }

      return updatedFormData;
    } catch (error) {
      console.error('Error submitting responses:', error);
      alert('An error occurred while submitting responses. Please try again later.');
      
    }
  }

  const endCall = async() => {
    if (vapi) {
      const formattedConversation = conversation
  .filter(msg => msg.speaker !== 'system')
  .map(msg => {
    const key = msg.speaker === 'ai' ? 'ai' : msg.speaker;
    return { [key]: msg.message };
  });

  console.log("Formatted Conversation", formattedConversation);

   const updatedData = await handleSubmit(formattedConversation);
    vapi.stop();

    if (updatedData) {
      navigate('/feed', { state: updatedData });
    }
  }
    setCallObject(null);
  };

  const toggleMute = () => {
    if (vapi) {
      const newMutedState = !isMuted;
      vapi.setMuted(newMutedState);
      setIsMuted(newMutedState);
      addMessage('system', newMutedState ? 'Microphone muted' : 'Microphone unmuted', 'system');
    }
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    if (videoRef.current && videoRef.current.srcObject) {
      const videoTrack = videoRef.current.srcObject.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoOn;
      }
    }
  };

  const sendMessage = () => {
    if (currentMessage.trim() && vapi && isConnected) {
      vapi.send({
        type: "add-message",
        message: {
          role: "user",
          content: currentMessage
        }
      });
      addMessage('user', currentMessage, 'chat');
      setCurrentMessage('');
    }
  };

  const handleCheatingDetected = (reason) => {
    console.warn('Cheating detected:', reason);
    setIsConnected(false);
    setCurrentSpeaker(null);
    setIsLoading(false);
    setConversation([]);
    addMessage('system', `Cheating detected: ${reason}`, 'error');
    endCall();
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Ques Ans Prep</h1>
        </div>
        {isConnected && <div className="text-red-600 font-bold text-xl">
                ⏳ {formatTime(timer)}
                </div>
        }
      </div>
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Main Video Area */}
        <div className="flex-1 flex flex-col">
          {/* Video Grid */}
          <div className="flex-1 bg-gray-100 p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
              {/* AI Screen */}
              <div className="bg-gray-800 rounded-2xl shadow-lg flex items-center justify-center relative min-h-[200px] md:min-h-[300px]">
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <Bot className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-white font-medium text-lg">AI Interviewer</p>
                  {currentSpeaker === 'ai' && (
                    <div className="flex justify-center mt-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  )}
                </div>
                
                
                <div className="absolute bottom-4 left-4">
                  <span className="text-white font-medium bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">AI Screen</span>
                </div>
              </div>

              
              {/* <div className="bg-gray-300 rounded-2xl overflow-hidden shadow-lg relative min-h-[200px] md:min-h-[300px]">
                <Detecting onCheatingDetected={handleCheatingDetected} />
              </div> */}
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="flex justify-center items-center gap-4 flex-wrap">
              <button
                onClick={toggleMute}
                disabled={!isConnected}
                className={`p-3 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  isMuted ? 'bg-red-500 hover:bg-red-600 text-white' : 
                  'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              
              <button
                onClick={toggleVideo}
                className={`p-3 rounded-full transition-all ${
                  !isVideoOn ? 'bg-red-500 hover:bg-red-600 text-white' : 
                  'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
                title={isVideoOn ? 'Turn Off Camera' : 'Turn On Camera'}
              >
                {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>
              
              {isConnected ? (
                <button
                  onClick={endCall}
                  className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full font-medium transition-all"
                  title="End call"
                >
                  End call
                </button>
              ) : (
                <button
                  onClick={startCall}
                  disabled={isLoading || !apiKey}
                  className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  title="Connect"
                >
                  {isLoading ? 'Connecting...' : 'Connect'}
                </button>
              )}
            </div>

            {/* Auto-feedback note */}
            <div className="text-center mt-4 text-sm text-gray-500">
              At the end of your conversation we will automatically generate feedback/notes from your conversation
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
       <div className="w-full lg:w-72  bg-white border-t lg:border-t-0 lg:border-l border-gray-200 flex flex-col">
  {/* Chat Header */}
  <div className="p-4 border-b border-gray-200 flex-shrink-0">
    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
      <MessageCircle className="w-5 h-5 text-blue-500" />
      Chat
    </h3>
  </div>
  
  {/* Messages - Scrollable */}
  <div 
    ref={conversationRef}
    className="flex-1 overflow-y-auto p-4 space-y-2"
  >
    {conversation.length === 0 ? (
      <div className="text-center text-gray-500 mt-8">
        <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p className="text-sm">Start a conversation to see messages here</p>
      </div>
    ) : (
      conversation.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${msg.speaker === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-xs rounded-2xl px-4 py-2 break-words ${
              msg.speaker === 'ai' ? 'bg-blue-500 text-white' :
              msg.speaker === 'user' ? 'bg-gray-200 text-gray-900' :
              'bg-gray-100 text-gray-600 text-center text-xs'
            }`}
          >
            {msg.speaker === 'ai' && (
              <div className="text-xs opacity-75 mb-1">AI: how can I help you</div>
            )}
            {msg.speaker === 'user' && msg.type !== 'system' && (
              <div className="text-xs opacity-75 mb-1">User:</div>
            )}
            <p className="text-sm">{msg.message}</p>
          </div>
        </div>
      ))
    )}
  </div>
  
  {/* Message Input */}
  <div className="p-4 border-t border-gray-200 flex-shrink-0">
    <div className="flex gap-2">
      <input
        type="text"
        value={currentMessage}
        onChange={(e) => setCurrentMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        placeholder="Enter the text"
        disabled={!isConnected}
        className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <button
        onClick={sendMessage}
        disabled={!isConnected || !currentMessage.trim()}
        className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-full px-4 py-2 text-white transition-colors text-sm font-medium"
        title="Send message"
      >
        Send
      </button>
    </div>
  </div>
</div>

      </div>
    </div>
  );
};

export default QuesAnsPrepApp;