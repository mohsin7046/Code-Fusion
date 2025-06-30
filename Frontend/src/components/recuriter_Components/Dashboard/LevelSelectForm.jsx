/* eslint-disable react/jsx-key */
import { useState, useMemo, useEffect } from "react";
import PhaseSelection from "./PhaseSelection";
import BehaviorSubject from "./BehaviourTest/BehaviorSubject";
import OnlineTest_Subject from "./OnlineTest/OnlineTest_Subject";
import GeneratedOnlineTest from "./OnlineTest/GeneratedOnlineTest";
import InterviewSummary from "./InterviewSummary";
import BasicInfo from './BasicInfo';
import { ArrowLeft } from "lucide-react";
import GeneratedBehavior from "./BehaviourTest/GeneratedBehavior";
import { getRecruiterToken } from "../../../hooks/role";
import CodingTest from "./CodingTest/codingTest";

function LevelSelectForm() {
  const [step, setStep] = useState(1);

  const [tokenData, setTokenData] = useState(null);

    const hasAIInterview = tokenData?.hasAiInterview;
  const hasOnlineTest = tokenData?.hasOnlineTest;
  const hasCodingTest = tokenData?.hasCodingTest;
  useEffect(() => {
    const token = getRecruiterToken();
    setTokenData(token);
  }, []);


  const steps = useMemo(() => {
    const dynamicSteps = [<BasicInfo Next={() => GoToNext()} />, <PhaseSelection Next={() => GoToNext()} />];
    if(tokenData){
    if (hasOnlineTest) {
      dynamicSteps.push(
        <OnlineTest_Subject Next={() => GoToNext()} />,
        <GeneratedOnlineTest Next={() => GoToNext()} />
      );
    }

    if (hasAIInterview) {
      dynamicSteps.push(
        <BehaviorSubject Next={() => GoToNext()} />,
        <GeneratedBehavior Next={() => GoToNext()} />
      );
    }

    if(hasCodingTest){
      dynamicSteps.push(
        <CodingTest Next={()=> GoToNext() } />
      )
    }

    dynamicSteps.push(<InterviewSummary />);
  }

    return dynamicSteps;
  }, [tokenData]);

  const totalSteps = steps.length;
  console.log(totalSteps)

  const GoToNext = () => {
    setStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const GoToBack = () => {
    if (step === 1) {
      window.location.href = '/dashboard';
      return;
    }
    setStep((prev) => prev - 1);
  };


 const rawPercent = ((step - 1) / (totalSteps - 1)) * 100;
const progressPercent = Math.max(5, Math.floor(rawPercent));

  return (
    <div className="flex flex-col h-auto w-full text-black items-center">
      <div className="flex flex-row items-center mb-6 font-semibold text-3xl self-start">
        <button onClick={GoToBack}>
          <ArrowLeft className="h-5 w-11 mt-2" />
        </button>
        <h1 className="text-start">Create New Interview</h1>
      </div>

      <div className="w-full rounded-full h-4 mb-4">
        <div
          className="h-6 pl-6 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500 text-white"
          style={{ width: `${progressPercent}%` }}
        >
          {progressPercent}%
        </div>
      </div>

      {steps[step - 1]}
    </div>
  );
}

export default LevelSelectForm;
