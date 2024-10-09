"use client";

import { useState, useEffect, useRef } from "react";

const SplineAnimation = ({ isPlaying }: { isPlaying: boolean }) => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  function onLoad() {
    setVideoLoaded(true);
  }

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {!videoLoaded && <div>Loading Video...</div>}
      <video
        ref={videoRef}
        src="https://pub-33c643825c664d0091b84d7ae37a5150.r2.dev/vapi.mp4"
        onLoadedData={onLoad}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        playsInline
        muted
        loop
      />
    </div>
  );
};

export default SplineAnimation;
