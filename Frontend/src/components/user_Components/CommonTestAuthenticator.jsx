import  { useState, useRef, useEffect } from 'react';
import { Camera, User, Clock, Shield, CheckCircle, AlertCircle, Play } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const CommonTestAuthenticator = () => {
  const [currentStep, setCurrentStep] = useState('initial');
  const [cameraPermission, setCameraPermission] = useState(false);
  const [videoStream, setVideoStream] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [studentData, setStudentData] = useState({
    name: '',
    password: '',
    email: ''
  });
  const [data,setData] = useState({
    title : '',
    description : '',
    duration : '',
    questions  : ''
  })

  const navigate = useNavigate();

  const { name,JobId } = useParams();

  console.log("JobId from params:", JobId);

  useEffect(()=>{
    const fetchDescription = async () => {
    try {
      const OA = '/api/user/onlinetest/getDescription';
      const BI = '/api/user/behaviouraltest/getBehaviourDescription';
      
      let endpoint="";
      if(name === 'onlineTest') {
        endpoint = OA;
      }
      if(name === 'behaviouralTest') {
        endpoint = BI;
      }

      if(endpoint === "") {
        alert('Endpoint not found');
        return;
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({jobId :  JobId })
      });

      const data = await res.json();
      if(!res.ok) {
       toast.error(data.message || "Failed to fetch test description");
        throw new Error("Failed to fetch test description");
      }
      setData({
        title : result.data?.title,
        description : result.data?.description,
        duration : result.data?.duration,
        questions  : result.data?.totalQuestions
      })
      toast.success(data.message || "Test description fetched successfully");
    } catch (error) {
    toast.error("An error occurred while fetching test description");
      console.error("Error in OnlineTestInterface:", error);
    }
  }

    fetchDescription();
    
  },[JobId])



  const handleEmailAndPassword = async(email, password) => {
   try {

    const OA = '/api/user/onlinetest/validateUser';
      const BI = '/api/user/behaviouraltest/Behavioral_validateUser';
      let endpoint="";
      if(name === 'onlineTest') {
        endpoint = OA;
      }
      if(name === 'behaviouralTest') {
        endpoint = BI;
      }

      if(endpoint === "") {
        alert('Endpoint not found');
        return;
      }

     if (!email || !password) {
       alert('Please enter both email and password');
       return;
     }

     console.log(email, password, JobId);
     
 
     const res = await fetch(endpoint, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({ email, password, JobId })
     });

     const data = await res.json();
     
 
     if(!res.ok) {
      toast.error(data.message || "Failed to validate user");
       return;
     }

    toast.success(data.message || "User validated successfully");

   } catch (error) {
    toast.error("An error occurred while validating user");
    console.log("Error in handleEmailAndPassword:", error);
   }
  }


  const updateisValidating = async() => {
    try {

      const OA = '/api/user/onlinetest/isValidatedCheck';
      const BI = '/api/user/behaviouraltest/isBehaviourValidatedCheck';
      let endpoint="";
      if(name === 'onlineTest') {
        endpoint = OA;
      }
      if(name === 'behaviouralTest') {
        endpoint = BI;
      }

     if (!studentData.email || !JobId) {
       toast.error('Email Not Found');
       return;
     }

     if(endpoint === "") {
       alert('Endpoint not found');
       return;
     }
 
     const res = await fetch(endpoint, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({ email: studentData.email, JobId })
     });
      const data = await res.json();
 
     if(!res.ok) {
        toast.error(data.message || "User validation failed");
       return;
      }

      toast.success(data.message || "User validation successful");
     const formData = {
      JobId: JobId,
      email: studentData.email,
      name: studentData.name,
     }

     if(name === 'onlineTest') {
     navigate('/test' , { state: formData  });
    }

    if(name === 'behaviouralTest') {
      navigate('/AItest' , { state: formData  });
    }

   } catch (error) {
    toast.error("An error occurred while checking validation");
     console.error("Error in updateisValidating:", error);}
  }
  

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  
  const testData = {
    instructions: [
      "Ensure stable internet connection throughout the test",
      "Camera must remain on for proctoring",
      "Switching tabs will be monitored",
      "No external resources allowed"
    ]
  };

  
  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 }, 
        audio: false 
      });
      setVideoStream(stream);
      setCameraPermission(true);
      setCurrentStep('validation');
      
      // Set video source after DOM update
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(console.error);
        }
      }, 100);
    } catch (error) {
      console.error('Camera permission denied:', error);
      alert('Camera permission is required to proceed with the test');
    }
  };

  

 // TODO: Implement a backend API to verify the user face and also store the image data
  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);
    
    return canvas.toDataURL('image/jpeg');
  };

  // Simulate user validation
  const validateUser = async () => {
    setIsValidating(true);
    
    // Simulate API call for face recognition/validation
    setTimeout(() => {
      const imageData = captureImage();
      // In real implementation, this would call backend API
      const isValid = Math.random() > 0.2; 
      
      setValidationResult({
        success: isValid,
        message: isValid ? "Identity verified successfully" : "Identity verification failed. Please try again."
      });
      setIsValidating(false);
      
      if (isValid) {
        setTimeout(() => setCurrentStep('ready'), 2000);
      }
    }, 3000);
  };



  const handleInputChange = (e) => {
    setStudentData({
      ...studentData,
      [e.target.name]: e.target.value
    });
  };


  const isFormValid = studentData.name && studentData.password && studentData.email;


  useEffect(() => {
    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [videoStream]);



  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">Online Test</h1>
          <div className="flex items-center justify-center gap-2 text-blue-600">
            <Shield className="w-5 h-5" />
            <span>Secure Proctored Examination</span>
          </div>
        </div>

        {currentStep === 'initial' && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">{data.title}</h2>
              <p className="text-gray-600 mb-6">{data.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <Clock className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <div className="text-sm text-gray-600">Duration</div>
                  <div className="font-semibold text-gray-800">{data.duration}</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <User className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <div className="text-sm text-gray-600">Questions</div>
                  <div className="font-semibold text-gray-800">{data.questions}</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <Camera className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <div className="text-sm text-gray-600">Proctored</div>
                  <div className="font-semibold text-gray-800">Yes</div>
                </div>
              </div>
            </div>

          
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Student Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={studentData.name}
                  onChange={handleInputChange}
                  className="bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
                <input
                  type="text"
                  name="password"
                  placeholder="Password"
                  value={studentData.password}
                  onChange={handleInputChange}
                  className="bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={studentData.email}
                  onChange={handleInputChange}
                  className="bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 md:col-span-2"
                />
              </div>
            </div>


            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Test Instructions</h3>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <ul className="space-y-2">
                  {testData.instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{instruction}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

    
            <div className="text-center">
              <button
                onClick={() => handleEmailAndPassword(studentData.email , studentData.password) && setCurrentStep('permission')}
                disabled={!isFormValid}
                className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
                  isFormValid
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Proceed to Camera Setup
              </button>
            </div>
          </div>
        )}

        
        {currentStep === 'permission' && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-lg p-8 text-center">
            <Camera className="w-16 h-16 mx-auto mb-4 text-blue-600" />
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Camera Access Required</h2>
            <p className="text-gray-600 mb-6">
              This test requires camera access for proctoring purposes. Please allow camera permission to continue.
            </p>
            <button
              onClick={requestCameraPermission}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold inline-flex items-center gap-2 shadow-lg"
            >
              <Camera className="w-5 h-5" />
              Access Camera
            </button>
          </div>
        )}

    
        {currentStep === 'validation' && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Camera Preview</h3>
                <div className="bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-64 object-cover"
                  />
                </div>
                <canvas ref={canvasRef} className="hidden" />
              </div>

              
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Identity Verification</h3>
                <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-100">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700">Camera access granted</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700">Student: {studentData.name}</span>
                    </div>
  
                  </div>
                </div>

                {!validationResult && (
                  <button
                    onClick={validateUser}
                    disabled={isValidating}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg"
                  >
                    {isValidating ? (
                      <span className="inline-flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Validating Identity...
                      </span>
                    ) : (
                      'Verify Identity'
                    )}
                  </button>
                )}

                {validationResult && (
                  <div className={`p-4 rounded-lg border ${
                    validationResult.success 
                      ? 'bg-green-50 border-green-200 text-green-800' 
                      : 'bg-red-50 border-red-200 text-red-800'
                  }`}>
                    <div className="flex items-center gap-2">
                      {validationResult.success ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <AlertCircle className="w-5 h-5" />
                      )}
                      <span>{validationResult.message}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {currentStep === 'ready' && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-lg p-8 text-center">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600" />
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Ready to Start Test</h2>
            <p className="text-gray-600 mb-6">
              All verification steps completed successfully. You can now start the test.
            </p>
            
            <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-100">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Student:</span>
                  <div className="font-semibold text-gray-800">{studentData.name}</div>
                </div>
                <div>
                  <span className="text-gray-600">Test:</span>
                  <div className="font-semibold text-gray-800">{testData.title}</div>
                </div>
                <div>
                  <span className="text-gray-600">Duration:</span>
                  <div className="font-semibold text-gray-800">{testData.duration}</div>
                </div>
              </div>
            </div>

            <button
              onClick={updateisValidating}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold inline-flex items-center gap-2 shadow-lg"
            >
              <Play className="w-5 h-5" />
              Start Test
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommonTestAuthenticator;