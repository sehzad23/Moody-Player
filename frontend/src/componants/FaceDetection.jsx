import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import MoodSongs from "../componants/MoodSongs";
import Footer from "./Footer";

const FaceDetection = () => {
  const videoRef = useRef(null);
  const [expression, setExpression] = useState("Detecting...");
  const [streamStarted, setStreamStarted] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);

  // Start webcam stream only once
  const startVideo = async () => {
    try {
      if (!streamStarted) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        videoRef.current.srcObject = stream;
        setStreamStarted(true);
      }
    } catch (err) {
      console.error("Error accessing webcam: ", err);
      setExpression("Camera access denied");
    }
  };

  const [songs, setSongs] = useState([]);

  // Detect face expression once per click
  const detectExpression = async () => {
    if (!videoRef.current) return;

    setIsDetecting(true);
    try {
      const detection = await faceapi
        .detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        )
        .withFaceExpressions();

      if (detection?.expressions) {
        const sorted = Object.entries(detection.expressions).sort(
          (a, b) => b[1] - a[1]
        );
        const mood = sorted[0][0];
        setExpression(mood);
        console.log("Detected expressions:", detection.expressions);

        // 👇 YAHI PAR BACKEND SE SONGS LAO
        const res = await fetch(`http://localhost:3000/songs?mood=${mood}`);
        const data = await res.json();
        console.log("Songs fetched:", data.songs);
        setSongs(data.songs); // save in state
      } else {
        setExpression("No face detected");
      }
    } catch (error) {
      console.error("Detection error:", error);
      setExpression("Error detecting face");
    }
    setIsDetecting(false);
  };

  // Handle button click: start video if needed, then detect once
  const handleButtonClick = async () => {
    if (!streamStarted) {
      await startVideo();
      // Give webcam some time to start
      setTimeout(() => {
        if (!isDetecting) detectExpression();
      }, 1000);
    } else {
      if (!isDetecting) detectExpression();
    }
  };

  // Load face-api models once
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      ]);
    };
    loadModels();
  }, []);

  return (
    <>
      <div className="bg-gray-300 min-h-screen w-full flex justify-center py-10 ">
        <div className="lg:w-[90%] max-w-6xl p-8 rounded-lg ">
          <h2 className="lg:text-3xl text-[20px] md:text-3xl font-bold mb-4 text-gray-700">
            Live Mood Detection:{" "}
            <span className="text-purple-600 capitalize">{expression}</span>
          </h2>

          <div className="flex flex-col lg:flex-row gap-8 items-start mb-10 ">
            <video
              ref={videoRef}
              autoPlay
              muted
              width="100%"
              height="250"
              className="lg:w-[35%] rounded-lg shadow border"
            />

            <div className="flex-1 flex flex-col gap-5">
              <p className="text-xl text-gray-900">
                Your current mood is being analyzed in real-time.
                <br />{" "}
                <span className="text-purple-700 font-semibold">
                  Enjoy music tailored
                </span>{" "}
                to your feelings!
              </p>

              <button
                onClick={handleButtonClick}
                className="bg-purple-700 lg:w-fit hover:bg-purple-800 text-white active:scale-95 lg:py-3 lg:px-7 rounded-lg shadow-md transition duration-200 py-3 px-5 md:w-fit w-full text-[17px]"
                disabled={isDetecting}
              >
                {isDetecting ? "Detecting..." : "Detect Mood"}
              </button>
            </div>
          </div>

          <MoodSongs songs={songs} />
        </div>
      </div>

      <Footer />
    </>
  );
};

export default FaceDetection;
