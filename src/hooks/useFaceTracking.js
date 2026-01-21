import { useState, useEffect, useRef } from 'react';
import { FaceLandmarker, HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

export const useFaceTracking = () => {
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [error, setError] = useState(null);
    const [trackingData, setTrackingData] = useState(null);

    // Refs for persistence
    const videoRef = useRef(null);
    const faceLandmarkerRef = useRef(null);
    const handLandmarkerRef = useRef(null);
    const requestRef = useRef(null);

    // Initialize MediaPipe Vision Models
    useEffect(() => {
        const initVision = async () => {
            try {
                const filesetResolver = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
                );

                // Load Face Landmarker
                faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(filesetResolver, {
                    baseOptions: {
                        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
                        delegate: "GPU"
                    },
                    outputFaceBlendshapes: true,
                    runningMode: "VIDEO",
                    numFaces: 1
                });

                // Load Hand Landmarker
                handLandmarkerRef.current = await HandLandmarker.createFromOptions(filesetResolver, {
                    baseOptions: {
                        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
                        delegate: "GPU"
                    },
                    runningMode: "VIDEO",
                    numHands: 2
                });

            } catch (err) {
                console.error("Failed to load Vision models", err);
                setError("Failed to load AI Vision models.");
            }
        };
        initVision();

        // Cleanup
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject;
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
            }
        };
    }, []);

    const startCamera = async () => {
        if (!faceLandmarkerRef.current || !handLandmarkerRef.current) {
            setError("AI Models still loading...");
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });

            // Create hidden video element
            const video = document.createElement("video");
            video.srcObject = stream;
            video.autoplay = true;
            video.playsInline = true;
            video.style.opacity = "0";
            video.style.position = "fixed";
            video.style.pointerEvents = "none";
            video.style.zIndex = "-1";
            document.body.appendChild(video);

            videoRef.current = video;

            video.onloadeddata = () => {
                setIsCameraActive(true);
                predictWebcam();
            };
        } catch (err) {
            console.error("Camera access denied", err);
            setError("Camera access denied.");
        }
    };

    const stopCamera = () => {
        if (videoRef.current) {
            const stream = videoRef.current.srcObject;
            if (stream) {
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
            }
            videoRef.current.remove();
            videoRef.current = null;
        }
        if (requestRef.current) {
            cancelAnimationFrame(requestRef.current);
        }
        setIsCameraActive(false);
        setTrackingData(null);
    };

    const predictWebcam = () => {
        const video = videoRef.current;
        const faceLandmarker = faceLandmarkerRef.current;
        const handLandmarker = handLandmarkerRef.current;

        if (video && faceLandmarker && handLandmarker) {
            const startTimeMs = performance.now();

            // Parallel Detections
            const faceResults = faceLandmarker.detectForVideo(video, startTimeMs);
            const handResults = handLandmarker.detectForVideo(video, startTimeMs);

            let newState = {};

            // Processing Face Data
            if (faceResults.faceLandmarks && faceResults.faceLandmarks.length > 0) {
                const landmarks = faceResults.faceLandmarks[0];

                // Index 1: Nose Tip
                // Index 454: Right Ear Tralion
                // Index 234: Left Ear Tralion
                // Index 10: Top of head
                // Index 152: Chin

                const nose = landmarks[1];
                const leftEar = landmarks[234];
                const rightEar = landmarks[454];

                const yaw = (nose.x - (leftEar.x + rightEar.x) / 2) * 5;
                const topHead = landmarks[10];
                const chin = landmarks[152];
                const pitch = (nose.y - (topHead.y + chin.y) / 2) * 4;
                const roll = (leftEar.y - rightEar.y) * 2;

                newState.head = {
                    x: pitch,
                    y: yaw,
                    z: roll
                };
            }

            // Processing Hand Data
            if (handResults.landmarks && handResults.landmarks.length > 0) {
                newState.hands = [];
                handResults.landmarks.forEach((landmarks, index) => {
                    // Extract Wrist Position (Index 0)
                    // We can also use Palm Center or Index Finger Tip
                    const wrist = landmarks[0];
                    const indexTip = landmarks[8];
                    const handedness = handResults.handedness[index][0]; // "Left" or "Right"

                    newState.hands.push({
                        type: handedness.categoryName, // "Left" or "Right"
                        wrist: wrist,
                        indexTip: indexTip
                    });
                });
            }

            setTrackingData(newState);
            requestRef.current = requestAnimationFrame(predictWebcam);
        }
    };

    return { trackingData, startCamera, stopCamera, isCameraActive, error };
};
