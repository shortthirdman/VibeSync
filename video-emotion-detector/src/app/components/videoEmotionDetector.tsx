'use client';
import React, { useRef, useEffect, useState } from 'react';
import { connect, LocalVideoTrack, Room } from 'twilio-video';
import { Rekognition } from 'aws-sdk';
import { Form, Button } from 'react-bootstrap';

const videoRef = useRef<HTMLVideoElement | null>(null)
const canvasRef = useRef<HTMLCanvasElement | null>(null)
/* eslint-disable  @typescript-eslint/no-explicit-any */
const [emotions, setEmotions] = useState<any[]>([])
const [room, setRoom] = useState<Room | null>(null)
const streamingRef = useRef(false)
const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff')
const ROOMNAME = 'EmotionDetectionRoom'

onst emotionColors: { [key: string]: string } = {
   HAPPY: '#FFD700',
   SAD: '#1E90FF',
   ANGRY: '#FF4500',
   SURPRISED: '#8A2BE2',
   DISGUSTED: '#228B22',
   CALM: '#87CEFA',
   CONFUSED: '#DA70D6',
};

useEffect(() => {
   return () => {
     room?.disconnect()
   };
 }, [room]);


const startTwilioVideo = async () => {
   try {
     const tokenResponse = await fetch('api/twilio-token', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ roomName: ROOMNAME }),
     });
     const { token } = await tokenResponse.json()
     const connectedRoom = await connect(token, { video: true, audio: false })
     setRoom(connectedRoom)
     connectedRoom.localParticipant.videoTracks.forEach((publication) => {
       const track = publication.track as LocalVideoTrack;
       if (videoRef.current) {
         videoRef.current.srcObject = new MediaStream([track.mediaStreamTrack])
         videoRef.current.play()
       }
     });
   } catch (err) {
     console.error('Error starting Twilio Video:', err)
   }
};

const stopTwilioVideo = () => {
   room?.disconnect()
   setRoom(null)
   if (videoRef.current) videoRef.current.srcObject = null
};

const analyzeFrame = async () => {
   if (!canvasRef.current || !videoRef.current) return
   const canvas = canvasRef.current
   const video = videoRef.current
   const context = canvas.getContext('2d')
   if (!context) return
   canvas.width = video.videoWidth
   canvas.height = video.videoHeight
   context.drawImage(video, 0, 0, canvas.width, canvas.height)
   const imageBlob = await new Promise<Blob | null>((resolve) => {
     canvas.toBlob((blob) => resolve(blob), 'image/jpeg')
   })
   if (!imageBlob) return;
   try {
     const rekognition = new Rekognition({
       accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
       secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
       region: process.env.NEXT_PUBLIC_AWS_REGION,
     })
     const imageBytes = await imageBlob.arrayBuffer()
     const params: Rekognition.DetectFacesRequest = {
       Image: { Bytes: new Uint8Array(imageBytes) },
       Attributes: ['ALL'],
     }
     const result = await rekognition.detectFaces(params).promise()
     const detectedEmotions =
       result.FaceDetails?.flatMap((face) =>
         face.Emotions?.filter((emotion) => emotion.Confidence! > 50).map((e) => e.Type)
       ) || []
     setEmotions(detectedEmotions)
     if (detectedEmotions.length > 0) {
       const primaryEmotion = detectedEmotions[0]?.toUpperCase()
       const color = emotionColors[(primaryEmotion ? primaryEmotion : 0)] || '#ffffff'
       setBackgroundColor(color)
     }
   } catch (err) {
     console.error('Error detecting emotions:', err)
   }
};

const startRealTimeAnalysis = () => {
   streamingRef.current = true
   const intervalId = setInterval(() => {
     if (!streamingRef.current) {
       clearInterval(intervalId)
     } else {
       analyzeFrame()
     }
   }, 1000)
};

const stopRealTimeAnalysis = () => {
   streamingRef.current = false
   setEmotions([])
   setBackgroundColor('#ffffff')
};

return (
   <div
     className="container mt-4"
     style={{
       backgroundColor: backgroundColor,
       transition: 'background-color 1s ease',
       minHeight: '100vh',
       padding: '20px',
     }}
   >
     <h1>Emotion Detection</h1>
     <div className="video-container" style={{ position: 'relative' }}>
       <video ref={videoRef} style={{ width: '100%', maxHeight: '400px', borderRadius: '8px' }} />
       <canvas ref={canvasRef} style={{ display: 'none' }} />
     </div>
     <Form.Group className="mt-4">
       {!room ? (
         <Button variant="primary" onClick={startTwilioVideo}>
           Start Video
         </Button>
       ) : (
         <Button variant="danger" onClick={stopTwilioVideo}>
           Stop Video
         </Button>
       )}
     </Form.Group>
     <Form.Group className="mt-4">
       {!streamingRef.current ? (
         <Button variant="primary" onClick={startRealTimeAnalysis} disabled={!room}>
           Start Real-Time Analysis
         </Button>
       ) : (
         <Button variant="danger" onClick={stopRealTimeAnalysis}>
           Stop Analysis
         </Button>
       )}
     </Form.Group>
     <div className="mt-4">
       <h3>Detected Emotions:</h3>
       {emotions.length > 0 ? (
         <ul>
           {emotions.map((emotion, index) => (
             <li key={index}>{emotion}</li>
           ))}
         </ul>
       ) : (
         <p>No emotions detected yet.</p>
       )}
     </div>
   </div>
 );

const VideoEmotionDetector: React.FC = () => {
};

export default VideoEmotionDetector