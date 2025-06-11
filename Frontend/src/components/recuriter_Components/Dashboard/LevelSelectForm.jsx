import { useState } from "react"
import PhaseSelection from "./PhaseSelection"
import BehaviorSubject from "./BehaviourTest/BehaviorSubject";
import OnlineTest_Subject from "./OnlineTest/OnlineTest_Subject";
import GeneratedOnlineTest from "./OnlineTest/GeneratedOnlineTest";
import InterviewSummary from "./InterviewSummary";
import BasicInfo from './BasicInfo'
import { ArrowLeft} from "lucide-react";

function LevelSelectForm() {
  const [step,setStep] = useState(1);

  const GoToNext=()=>{
    setStep(step+1);
  }
  const GoToBack = ()=>{
    if(step === 1) {
      window.location.href = '/dashboard';
      return;
    };
    setStep(step-1);
  }
  

  return (
    <div className="flex flex-col h-auto w-full text-black items-center">
      <div className="flex flex-row items-center mb-6 font-semibold text-3xl self-start">
        <button onClick={GoToBack}><ArrowLeft  className="h-5 w-11 mt-2" /></button>
        <h1 className="text-start">Create New Interview</h1>
      </div>
        <div className="w-full rounded-full h-4 ">
        <div
            className="h-6 pl-44 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500 text-white mb-4"
            style={{ width: `${step * 16.67}%` }}
        > {Math.floor(step * 16.67)}%</div>

        {
          step == 1 ?(
            <BasicInfo Next={() => GoToNext()}/>
          ):
          step === 2?(
            <PhaseSelection Next={() => GoToNext()} />
          ) : step === 3 ? (
            <OnlineTest_Subject Next={() => GoToNext()}  />
          ):step === 4 ? (
            <GeneratedOnlineTest Next={() => GoToNext()} />
          ) : step === 5 ? (
            <BehaviorSubject Next={() => GoToNext()}  />
          ) : step === 6 ? (
            <InterviewSummary />
          ) : null
        }
      </div>
    </div>
  )
}

export default LevelSelectForm