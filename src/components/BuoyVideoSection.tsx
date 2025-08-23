import React from 'react';
import buoyVideo from '../assets/buoy-video.mp4';

const BuoyVideoSection = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Clean full screen video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
      >
        <source src={buoyVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </section>
  );
};

export default BuoyVideoSection;
