/* eslint-disable react/prop-types */
import { icons } from "lucide-react"

function PhaseSelection(props) {
    const phases = [
        { title : "Online Test", desc : "Automated assessment to evaluate candidates' skills and knowledge.",icon : icons.FileCheck },
        { title : "AI Behavioral Interview", desc : "Ai driven Interview test the communication skills and cultural fit",icon : icons.Brain },
        { title : "Live Coding Interview", desc : "Real time Collaborative Coding Experience that check the problem solving skills and technical abilities",icon : icons.Brackets},
    ]
  return (
    <div className="flex flex-col h-auto w-full text-black bg-white border rounded-lg shadow-lg p-6">
        <h2 className="text-black font-bold mb-5">Select Interview Phases</h2>
        <p className="text-gray-500 mb-4">Choose Which phase you want to put into Interview.You can choose any Combination</p>
        {phases.map((phase, index) => (
            <div key={index} className="flex items-center gap-4 p-4 border rounded-lg my-2">
                <input type="checkbox" name="checkbox" id="checkbox" />
                <phase.icon className="w-6 h-6 text-blue-500" />
                <div>
                    <h4 className="text-lg font-semibold">{phase.title}</h4>
                    <p className="text-sm text-gray-600">{phase.desc}</p>
                </div>
            </div>
        ))}
        <div className="mt-8 flex justify-end w-full">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200" onClick={props.Next}>Next ▶️</button>
        </div>
    </div>
  )
}

export default PhaseSelection