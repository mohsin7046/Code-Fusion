import { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";

const Proctoring = ({ onCheatingDetected }) => {
  const webcamRef = useRef(null);
  const [cheatingStatus, setCheatingStatus] = useState(null);
  const cheatingAlreadyDetectedRef = useRef(false);

  useEffect(() => {
    const loadModelAndDetect = async () => {
      const model = await cocoSsd.load();

      const checkForCheating = async () => {
        if (
          webcamRef.current &&
          webcamRef.current.video.readyState === 4 &&
          !cheatingAlreadyDetectedRef.current
        ) {
          try {
            const detections = await model.detect(webcamRef.current.video);
            const personCount = detections.filter(
              (det) => det.class === "person"
            ).length;

            console.log("Detected persons:", personCount);

            if (personCount >= 2) {
              cheatingAlreadyDetectedRef.current = true;
              setCheatingStatus("multiple_people");
              onCheatingDetected("Multiple people detected");
            } else if (personCount === 0) {
              cheatingAlreadyDetectedRef.current = true;
              setCheatingStatus("no_person");
              onCheatingDetected("No person detected");
            } else {
              setCheatingStatus(null);
            }
          } catch (error) {
            console.error("Error during object detection:", error);
          }
        }
      };

      const intervalId = setInterval(checkForCheating, 3000);

      return () => clearInterval(intervalId);
    };

    loadModelAndDetect();
  }, [onCheatingDetected]);

  return (
    <div className="relative">
      <Webcam
        ref={webcamRef}
        className="w-full h-auto rounded-md shadow-md"
        screenshotFormat="image/jpeg"
        mirrored={true}
      />

      {cheatingStatus === "multiple_people" && (
        <div className="absolute top-0 left-0 right-0 bg-red-500 text-white p-2 text-center font-bold">
          Cheating Detected! More than one person in the frame.
        </div>
      )}

      {cheatingStatus === "no_person" && (
        <div className="absolute top-0 left-0 right-0 bg-red-500 text-white p-2 text-center font-bold">
          Cheating Detected! No person detected.
        </div>
      )}
    </div>
  );
};

export default Proctoring;
