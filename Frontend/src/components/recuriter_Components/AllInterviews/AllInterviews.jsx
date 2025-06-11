import { ArrowLeft } from "lucide-react"
import {Link} from 'react-router-dom'
function AllInterviews() {
     const interviews = [
    {
      name: "AI role",
      description: "This is for frontend, backend, database expert",
      date : "2023-10-15",
      time: "10:00 AM",
      status: "completed",
    },{
      name: "PERN stack role",
      description: "This is for frontend, backend, database expert using PERN stack",
      date : "2023-10-16",
      time: "12:00 AM",
      status: "completed",
    }
    ]

  return (
        <>
    <div className="p-6 text-black">
        <div className="flex flex-row items-center  font-semibold text-3xl self-start "> 
            <ArrowLeft onClick={()=> window.location.href='/dashboard'} className="w-8 h-5 mb-4"  />
            <h2 className="text-2xl font-semibold mb-4">All Interview</h2>
        </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-600 text-left">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Description</th>
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">Time</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">More</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {interviews.map((item,index) => (
              <tr key={item.id} className="transition">
                <td className="px-4 py-2 border">{index+1}</td>
                <td className="px-4 py-2 border">{item.name}</td>
                <td className="px-4 py-2 border">{item.description}</td>
                <td className="px-4 py-2 border">{item.date}</td>
                <td className="px-4 py-2 border">{item.time}</td>
                <td className="px-4 py-2 border">{item.status}</td>
                <td className="px-4 py-2 border">
                  <Link to={`/dashboard/all-interview/${index+1}`}>
                  <button className="bg-gray-700 text-white px-3 py-1 rounded">
                    Detailed Overview
                  </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
  )
}

export default AllInterviews