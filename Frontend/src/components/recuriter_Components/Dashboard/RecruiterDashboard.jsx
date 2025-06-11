import {Link} from 'react-router-dom'

const RecuriterDashboard = () => {
    return (
        <>
        <div className="flex flex-col h-auto w-full text-black items-center" >
            <h1 className="text-4xl font-bold mb-10">Recruiter Dashboard</h1>
            <div className="flex flex-row gap-8 items-center justify-center">
                
            <div className="border-2 border-gray-300 rounded-lg p-6">
               <h6>Create new Interview</h6>
               <p>Create Ai Interviews and Schedule them with candidates</p>
               <Link to="/dashboard/create-interview">
               <button className="border-2 border-gray-400 w-32 h-12 rounded-lg">Start Now</button>
               </Link>
            </div>

            <div className="border-2 border-gray-300 rounded-lg p-6 ml-20">
                 <h6>Create Phone Screening Meeting Call</h6>
                <p>Schedule Phone Screening Call with Potential Candidates</p>
                <Link to="/dashboard/meetings">
                <button className="border-2 border-gray-400 w-32 h-12 rounded-lg">
                    Start Call
                </button>
                </Link>
            </div>
        </div>
        </div>
        </>
    );
};

export default RecuriterDashboard;
