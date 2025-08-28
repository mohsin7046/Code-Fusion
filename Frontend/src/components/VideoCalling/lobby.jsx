import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const Home = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  const { jobId } = useParams();

  const navigate = useNavigate();

  const handleJoin = async () => {
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    const res = await fetch("/api/user/codingtest/CodingTestvalidateUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        jobId: jobId || "",
        password: password,
      }),
    });

    const data = await res.json();
    console.log("Response from validateUser:", data);
    
    console.log(data?.data?.codingTests[0]?.id);
    console.log(data?.data?.CandidateJobApplication[0]?.id);
    
    if (!res.ok) {
      toast.error(data.message || "Failed to Validate User");
      throw new Error("Failed to Validate User");
    }

    toast.success(`Welcome ${name}! Joining room...`);

    const createResponse = await fetch('/api/user/codingtest/CodingTestResponse',{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        codingTestId:data?.data?.codingTests[0]?.id,
        candidateId:email,
        candidateJobApplicationId:data?.data?.CandidateJobApplication[0]?.id
      }),
    })

    if(!createResponse){
      toast.error("Error creating your Response!!")
    }

   
    toast.success("Your Response has stored!!")

    const roomId = Math.random().toString(36).substr(2, 9);

    console.log("HOST",data?.data?.user?.username);
    

     const roomCreated = await fetch('/api/user/codingtest/createRoom',{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        codingTestId:data?.data?.codingTests[0]?.id,
        jobId:jobId,
        recruiterId:data?.data?.user?.id,
        roomId:roomId,
        host:data?.data?.user?.username
      }),
    });

    if(!roomCreated.ok){
      toast.error("Error creating room!!");
    }
    toast.success("Room created successfully!");

    navigate(`/room/${roomId}`, { state: { name, jobId, userId: data && data.data ? data.data.id : undefined,email } });
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-8">
      <div className="text-center mb-8 max-w-2xl">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
          CodeMeet
        </h1>
        <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
          Real-time video conferencing and collaborative coding platform
          connecting students and recruiters
        </p>
      </div>

      <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-8 w-full max-w-md border border-white/20">
        <div className="space-y-5">
          <div>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
            />
          </div>

          <div>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}

          <button
            onClick={handleJoin}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Join CodeMeet
          </button>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">Secure • Fast • Collaborative</p>
      </div>
    </div>
  );
};

export default Home;
