import { ArrowLeft } from "lucide-react";

 const meetings = [
    {
      name: "Full stack role",
      date : "2023-10-15",
      time: "10:00 AM",
      status: "scheducled",
    },{
      name: "Mern stack role",
      date : "2023-10-16",
      time: "12:00 AM",
      status: "completed",
    }
    ]

function AllMeetings() {
  return (
        <>
    <div className="p-6 text-black">
        <div className="flex flex-row items-center  font-semibold text-3xl self-start "> 
            <ArrowLeft onClick={()=> window.location.href='/dashboard'} className="w-8 h-5 mb-4"  />
            <h2 className="text-2xl font-semibold mb-4">All Meeting</h2>
        </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-600 text-left">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">Time</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">More</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {meetings.map((item,index) => (
              <tr key={item.id} className="transition">
                <td className="px-4 py-2 border">{index+1}</td>
                <td className="px-4 py-2 border">{item.name}</td>
                <td className="px-4 py-2 border">{item.date}</td>
                <td className="px-4 py-2 border">{item.time}</td>
                <td className="px-4 py-2 border">{item.status}</td>
                <td className="px-4 py-2 border">
                  <button className="bg-gray-700 text-white px-3 py-1 rounded">
                    Detailed Overview
                  </button>
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
export default AllMeetings;