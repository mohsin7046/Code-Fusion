import  { useState } from 'react';
import { ChevronDown, BarChart3, User, CheckCircle, AlertCircle, ChevronRight, ArrowLeft } from 'lucide-react';

const UserInterviewFeedback = () => {
  const [selectedPhase, setSelectedPhase] = useState('behavior');

  const phaseData = {
    online: {
      title: 'Online Assessment',
      overallScore: 85,
      scoreColor: 'text-blue-800',
      scoreBg: 'bg-blue-50 border-blue-200',
      secondaryInfo: {
        label: 'Correct Answers',
        value: '17/20',
        icon: CheckCircle,
        color: 'text-green-800',
        bg: 'bg-green-50 border-green-200'
      },
      skills: [
        { name: 'JavaScript Fundamentals', score: 9 },
        { name: 'React Components', score: 8 },
        { name: 'Node.js Basics', score: 7 },
        { name: 'Database Queries', score: 6 },
        { name: 'System Design', score: 7 }
      ],
      highlights: [
        'Strong JavaScript fundamentals',
        'Good understanding of React lifecycle',
        'Solid grasp of asynchronous programming'
      ],
      improvements: [
        'Database optimization techniques need work',
        'System design concepts require more practice'
      ]
    },
    behavior: {
      title: 'Behavioral Interview',
      overallScore: 92,
      scoreColor: 'text-blue-800',
      scoreBg: 'bg-blue-50 border-blue-200',
      secondaryInfo: {
        label: 'Interviewer',
        value: 'Sarah Johnson',
        icon: User,
        color: 'text-green-800',
        bg: 'bg-green-50 border-green-200'
      },
      skills: [
        { name: 'Communication Skills', score: 9 },
        { name: 'Teamwork', score: 8 },
        { name: 'Problem Solving', score: 9 },
        { name: 'Leadership', score: 8 },
        { name: 'Culture Fit', score: 9 }
      ],
      highlights: [
        'Excellent communication skills',
        'Strong team leadership experience',
        'Good problem-solving approach'
      ],
      improvements: [
        'Could improve on handling conflict situations'
      ]
    },
    codetest: {
      title: 'Code Test',
      overallScore: 88,
      scoreColor: 'text-blue-800',
      scoreBg: 'bg-blue-50 border-blue-200',
      secondaryInfo: {
        label: 'Problems Solved',
        value: '3/4',
        icon: CheckCircle,
        color: 'text-green-800',
        bg: 'bg-green-50 border-green-200'
      },
      skills: [
        { name: 'Coding Skills', score: 9 },
        { name: 'Algorithmic Thinking', score: 8 },
        { name: 'Code Quality', score: 9 },
        { name: 'Debugging', score: 8 },
        { name: 'System Design', score: 7 }
      ],
      highlights: [
        'Clean, readable code structure',
        'Strong algorithmic problem-solving',
        'Good understanding of time complexity'
      ],
      improvements: [
        'Could optimize space complexity in solutions',
        'System design architecture needs improvement'
      ]
    }
  };

  const currentData = phaseData[selectedPhase];
  const SecondaryIcon = currentData.secondaryInfo.icon;

  return (
    <div>
    <div className="flex flex-row items-center  font-semibold text-3xl self-start "> 
        <ArrowLeft onClick={()=> window.location.href='/user/dashboard'} className="w-8 h-5 mb-4"  />
        <h2 className="text-2xl font-semibold mb-4">Feedback</h2>
    </div>
    <div className="mx-auto p-6 bg-white">
      {/* Header with Dropdown */}
      <div className="flex justify-between items-start mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Interview Assessment</h1>
        
        {/* Dropdown */}
        <div className="relative">
          <select
            value={selectedPhase}
            onChange={(e) => setSelectedPhase(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
          >
            <option value="online">Online Assessment</option>
            <option value="behavior">Behavioral Interview</option>
            <option value="codetest">Code Test</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Overall Score Card */}
        <div className={`p-6 rounded-lg border ${currentData.scoreBg}`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-600">Overall Score</h3>
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>
          <p className={`text-3xl font-bold ${currentData.scoreColor}`}>
            {currentData.overallScore}%
          </p>
        </div>

        {/* Secondary Info Card */}
        <div className={`p-6 rounded-lg border ${currentData.secondaryInfo.bg}`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-600">
              {currentData.secondaryInfo.label}
            </h3>
            <SecondaryIcon className="w-5 h-5 text-green-600" />
          </div>
          <p className={`text-2xl font-bold ${currentData.secondaryInfo.color}`}>
            {currentData.secondaryInfo.value}
          </p>
        </div>
      </div>

      {/* Skill Assessment */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Skill Assessment</h2>
        <div className="space-y-4">
          {currentData.skills.map((skill, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 flex-1">
                {skill.name}
              </span>
              <div className="flex items-center space-x-3 flex-1 justify-end">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${(skill.score / 10) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-gray-600 w-8 text-right">
                  {skill.score}/10
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Highlights */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Key Highlights</h2>
        </div>
        <div className="space-y-3">
          {currentData.highlights.map((highlight, index) => (
            <div key={index} className="flex items-start">
              <ChevronRight className="w-4 h-4 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
              <span className="text-sm text-gray-700">{highlight}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Areas for Improvement */}
      <div>
        <div className="flex items-center mb-4">
          <AlertCircle className="w-5 h-5 text-orange-500 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Areas for Improvement</h2>
        </div>
        <div className="space-y-3">
          {currentData.improvements.map((improvement, index) => (
            <div key={index} className="flex items-start">
              <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 mr-3 flex-shrink-0" />
              <span className="text-sm text-gray-700">{improvement}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
};

export default UserInterviewFeedback;