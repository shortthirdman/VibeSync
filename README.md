# VibeSync

> [Building a Real-Time Video Emotion Detection App with Twilio Video and AWS Rekognition](https://www.twilio.com/en-us/blog/detect-emotions-video-calls-twilio-aws-rekognition)

Imagine taking virtual meetings and video calls to a whole new level by detecting emotions in real time. By combining the capabilities of [Twilio Video](https://www.twilio.com/docs/video) and [AWS Rekognition](https://aws.amazon.com/rekognition/), you can build a system that analyzes facial expressions and offers deep insights into how participants are truly feeling. The `Video Emotion Detector` app brings this vision to life by merging live video calls with advanced facial analysis. It captures video frames from a participant's webcam, processes them through a canvas element, and sends the data to AWS Rekognition for emotion detection. Emotions like happiness, sadness, or anger are then identified and displayed instantly, with the background color dynamically changing to reflect the most dominant emotion. This powerful integration adds an interactive, empathetic dimension to virtual communication, making video calls not just more engaging, but also more emotionally intelligent.


<!-- In the world of virtual meetings and video calls, what if we could take things to the next level by actually detecting emotions from Twilio Video in real time? With the power of Twilio Video and AWS Rekognition, we’ll dive into how you can build a system that analyzes facial expressions and gives you insight into how your participants are truly feeling. The Video Emotion Detector app combines real-time video calling via Twilio Video with advanced facial analysis provided by AWS Rekognition. It captures video frames from a participant's webcam, processes them through a canvas element, and sends the frame data to AWS Rekognition to analyze facial expressions. Detected emotions, such as happiness, anger, or sadness, are displayed in real-time, and the app dynamically updates the background color to visually represent the dominant emotion. This seamless integration of technologies provides an interactive and empathetic layer to virtual communication, making video calls more engaging and emotionally aware. -->


### Prerequisites

- A `Twilio` account with an Account SID, an API Key and an API Secret

- AWS Account with an `AWS Rekognition` User, Access token, and Access token secret.

- Familiarity with `Next.js`

- Familiarity with `Typescript`

- Familiarity with `React`

- Familiarity with `React-Bootstrap`


### Integrating AWS Rekognition for Emotion Detection

AWS Rekognition is a powerful tool for image and video analysis, offering facial recognition and emotion detection features. Once the user’s webcam feed is available through Twilio Video, we can pass the video frames to AWS Rekognition to analyze emotions. AWS Rekognition detects various emotions such as happy, sad, surprised, angry, and more by analyzing facial expressions.