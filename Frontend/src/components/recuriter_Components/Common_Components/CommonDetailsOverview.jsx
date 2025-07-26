import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import getToken from "../../../hooks/role.js";
import { UseCandidateShortlist } from "../../../hooks/useCandidateShortlistOnline.jsx";
import { UseCandidateBehavioural } from '../../../hooks/useCandidateBehavioural.jsx';
import TestDropdown from './TestDropdown.jsx';
import ViewButtons from './ViewButtons.jsx';
import CandidateTable from './CandidateTable.jsx';
import CandidateDetailView from './CandidateDetailView.jsx';
import { getStatusColor, getShortlistCondition, getFeedbackData } from './utilityFunctions.js';

const CommonDetailsOverview = () => {
  const [selectedTest, setSelectedTest] = useState("online");
  const [selectedView, setSelectedView] = useState("total");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showDetailedOverview, setShowDetailedOverview] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [onlinedata, setonlinedata] = useState(null);
  const [behaviouraldata, setbehaviouraldata] = useState(null);
  const [codingdata, setCodingdata] = useState(null);

  const location = useLocation();
  const {jobId} = location.state;
  const recruiterToken = getToken();
  const {onlineTestShortList} = UseCandidateShortlist();
  const {behaviouralTestShortList} = UseCandidateBehavioural();

  const [ShortlistItem,setShortlistItem] = useState([])

  useEffect(() => {
    const handlegetbehaviouralCurrentData = async () => {
      try {
        const res = await fetch("/api/recruiter/get-dashboard-behaviour-test", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recruiterId: recruiterToken.userId,
            jobId: jobId,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          console.error("Error fetching data:", data.message);
        }
        setbehaviouraldata(data);
        console.log("Fetched data from behaviour :", data);
        console.log("Fetched behaviour data:", behaviouraldata);
      } catch (error) {
        console.error("Error fetching behavioural test data:", error);
      }
    };

    const handlegetOnlineTestCurrentData = async () => {
      try {
        const res = await fetch("/api/recruiter/getOnlineTestData", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recruiterId: recruiterToken.userId,
            jobId: jobId,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          console.error("Error fetching data from online:", data.message);
        }
        setonlinedata(data.data);
        console.log("Fetched data from online:", data);
        console.log("Fetched online data:", onlinedata);
      } catch (error) {
        console.error("Error fetching online test data:", error);
      }
    };

    const handlegetCodingTestCurrentData = async () => {
      try {
        const res = await fetch("/api/recruiter/getCodingTestDashboard", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recruiterId: recruiterToken.userId,
            jobId: jobId,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          console.error("Error fetching data from coding:", data.message);
        }
        setCodingdata(data.data);
        console.log("Fetched data from coding:", data);
        console.log("Fetched coding data:", codingdata);
      } catch (error) {
        console.error("Error fetching coding test data:", error);
      }
    };

    const fetchData = async () => {
      try {
        await handlegetbehaviouralCurrentData();
        await handlegetOnlineTestCurrentData();
        await handlegetCodingTestCurrentData();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  console.log("State Data", onlinedata);
  console.log("Behavior data", behaviouraldata);

  const testData = {
    online: {
      name: "Online Test",
      total: onlinedata,
      shortlisted: onlinedata,
      feedback: onlinedata
    },
    behavioral: {
      name: "Behavioural Test",
      total: behaviouraldata?.data,
      shortlisted: behaviouraldata?.data,
      feedback: behaviouraldata?.data,
    },
    coding: {
      name: "Coding Test",
      total: codingdata?.data
    },
  };

  const getCurrentData = () => {
    return testData[selectedTest][selectedView] || [];
  };

  const handleOnlineShortlist = async (index) =>{
    const totalData = getCurrentData();
   const onlineResponseId =  totalData?.CandidateJobApplication[0]?.onlineTestResponse[index].id;
    try {
      const res = await onlineTestShortList(onlineResponseId);
      if(!res.success){
        console.error("Error updating online test response:", res.message);
        alert("Failed to update online test response. Please try again.");
        return;
      }
      console.log("Updated online test response:", res.message);
      alert("Online test response updated successfully.");
    } catch (error) {
      console.error("Error updating online test response:", error.message);
      alert("Failed to update online test response. Please try again.");
    }
  }

  const handleBehaviouralShortlist = async (index) =>{
    const totalData = getCurrentData();
    const behaviouralTestId = totalData?.CandidateJobApplication[0]?.aiInterviewResponse[index]?.id;
     try {
      const res = await behaviouralTestShortList(behaviouralTestId);
      if(!res.success){
        console.error("Error updating behaviour test response:", res.message);
        alert("Failed to update behaviour test response. Please try again.");
        return;
      }
      console.log("Updated behaviour test response:", res.message);
      alert("Behaviour test response updated successfully.");
    } catch (error) {
      console.error("Error updating behaviour test response:", error.message);
      alert("Failed to update behaviour test response. Please try again.");
    }
  }

  const handleAcceptAll = async (selectedTest) => {
    let emails;
    let totalData;
    console.log("Emails of shortlisted:",ShortlistItem);
    
    if(selectedTest === 'online'){
      totalData = getCurrentData();
      emails = totalData?.CandidateJobApplication[0].onlineTestResponse.map(item => item.passed ? item.candidateId : null).filter(email => email !== null);
      console.log("Shortlisted Emails:",emails);
      
      try {
        const res = await fetch('/api/recruiter/updateOnlineShortListedEmails',{
          method : 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jobId : jobId,
            emails: emails
          })
        })
        const data = await res.json();
        if(!res.ok){
          console.error("Error accepting all online test responses:", data.message);
          alert("Failed to accept all online test responses. Please try again.");
          return;
        }
        console.log("Accepted all online test responses:", data.message);
        alert("All online test responses accepted successfully.");
      } catch (error) {
        console.error("Error accepting all online test responses:", error.message);
        alert("Failed to accept all online test responses. Please try again.");
      }
    }else if(selectedTest === 'behavioral'){
      totalData = getCurrentData();
      emails = totalData?.CandidateJobApplication.map(item => item.aiInterviewResponse[0].passed ? item.candidateId : null).filter(email => email !== null);
      try {
        const res = await fetch('/api/recruiter/updateBehaviouralShortlistedEmails',{
          method : 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jobId : jobId,
            emails: emails
          })
        })
        const data = await res.json();
        if(!res.ok){
          console.error("Error accepting all behavioral test responses:", data.message);
          alert("Failed to accept all behavioral test responses. Please try again.");
          return;
        }
        console.log("Accepted all behavioral test responses:", data.message);
        alert("All behavioral test responses accepted successfully.");
      } catch (error) {
        console.error("Error accepting all behavioral test responses:", error.message);
        alert("Failed to accept all behavioral test responses. Please try again.");
      }
    }
  }

  const handleDecline = async (index,selectedTest) =>{
    if(selectedTest === "online"){
      const totalData = getCurrentData();
      const onlineResponseId =  totalData?.CandidateJobApplication[0]?.onlineTestResponse[index].id;
    try {
      const res = await onlineTestShortList(onlineResponseId);
      if(!res.success){
        console.error("Error updating online test response:", res.message);
        alert("Failed to update online test response. Please try again.");
        return;
      }
      console.log("Updated online test response:", res.message);
      alert("Online test response updated successfully.");
    } catch (error) {
      console.error("Error updating online test response:", error.message);
      alert("Failed to update online test response. Please try again.");
    }
    }else if(selectedTest === "behavioral"){
      const totalData = getCurrentData();
      const behaviouralTestId = totalData?.CandidateJobApplication[index]?.aiInterviewResponse[index]?.id;
     try {
       const res = await behaviouralTestShortList(behaviouralTestId);
      if(!res.success){
        console.error("Error updating behaviour test response:", res.message);
        alert("Failed to update behaviour test response. Please try again.");
        return;
      }
      console.log("Updated behaviour test response:", res.message);
      alert("Behaviour test response updated successfully.");
    } catch (error) {
      console.error("Error updating behaviour test response:", error.message);
      alert("Failed to update behaviour test response. Please try again.");
    }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Dropdown */}
        <TestDropdown 
          selectedTest={selectedTest}
          setSelectedTest={setSelectedTest}
          setSelectedView={setSelectedView}
          dropdownOpen={dropdownOpen}
          setDropdownOpen={setDropdownOpen}
        />

        {/* Test Section */}
        <div className="bg-white rounded-lg border border-gray-300 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {testData[selectedTest].name}
          </h2>

          {/* Buttons */}
          <ViewButtons selectedView={selectedView} setSelectedView={setSelectedView} />

          {/* Table */}
          <CandidateTable 
            selectedTest={selectedTest}
            selectedView={selectedView}
            getCurrentData={getCurrentData}
            getStatusColor={getStatusColor}
            getShortlistCondition={getShortlistCondition}
            getFeedbackData={getFeedbackData}
            setShortlistItem={setShortlistItem}
            handleOnlineShortlist={handleOnlineShortlist}
            handleBehaviouralShortlist={handleBehaviouralShortlist}
            setSelectedCandidate={setSelectedCandidate}
            setShowDetailedOverview={setShowDetailedOverview}
            handleDecline={handleDecline}
            onlinedata={onlinedata}
            behaviouraldata={behaviouraldata}
            handleAcceptAll={handleAcceptAll}
          />
        </div>
      </div>

      {showDetailedOverview && selectedCandidate && (
        <CandidateDetailView
          candidate={selectedCandidate}
          selectedTest={selectedTest}
          selectedView={selectedView}
          setShowDetailedOverview={setShowDetailedOverview}
        />
      )}
    </div>
  );
};

export default CommonDetailsOverview;