/* eslint-disable react/prop-types */
function InterviewSummary() {
    const list = [
        {title : "Online Test", desc: "Automated assessment to evaluate candidates' skills and knowledge.",tags: ['JavaScript', 'React', 'Node.js']},
        {title : "AI Behavioral Interview", desc: "Ai driven Interview test the communication skills and cultural fit",tags: ['Communication', 'Problem Solving', 'Teamwork']},
        {title : "Live Coding Interview", desc: "Real time Collaborative Coding Experience that check the problem solving skills and technical abilities",tags: ['JavaScript', 'Python', 'Algorithms']}
    ]
    return (
        
        <div className="flex flex-col h-auto w-full text-black bg-white border rounded-lg shadow-lg p-6">
                <h1 className="text-black text-2xl font-semibold mb-5">Interview Summary</h1>
                <p className="text-gray-500 mb-4">Review the selected interview phases and their details before proceeding.</p>
                <div className="bg-white border rounded-lg shadow-lg p-6 mt-10">
                    {list.map((item, index) => (
                        <div key={index} className="border-b last:border-b-0 py-4">
                            <h2 className="text-xl font-semibold">{item.title}</h2>
                            <p className="text-gray-600 mb-2">{item.desc}</p>
                            <div className="flex flex-wrap gap-2">
                                {item.tags.map((tag, tagIndex) => (
                                    <span key={tagIndex} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))} 
            </div>
            <div className="mt-8 flex justify-end w-full">
                
                <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200">Confirm</button>
            </div>
        </div>
    )
}

export default InterviewSummary;