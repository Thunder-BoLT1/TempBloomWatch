import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Using Link for navigation
import styles from './AIChatBubble.module.css'; // Import the CSS module

// Import the image you provided
import AIIcon from './bot.avif'; // Assuming you save the image as ai-robot.png in src/assets

function AIChatBubble() {
  const [isHovered, setIsHovered] = useState(false);

  // Define the feature links as objects
  const featureLinks = [
    { text: "See from Space", path: "/Dashboard" },
    { text: "Understand the Data", path: "/Data" },
    { text: "Stay Safe (Health & Pollen)", path: "/HealthPollen" },
  ];

  return (
    <div
      className={styles.aiChatContainer}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* The AI icon */}
      <div className={styles.aiIcon}>
        <img src={AIIcon} alt="AI Assistant" />
      </div>

      {/* The chat bubble that appears on hover */}
      <div className={`${styles.chatBubble} ${isHovered ? styles.chatBubbleVisible : ''}`}>
        <p className={styles.chatMessage}>Hello sir, meet our models!</p>
        <div className={styles.chatLinks}>
          {featureLinks.map((feature, index) => (
            <Link
              key={index}
              to={feature.path}
              className={styles.chatLink}
              // Close the bubble when a link is clicked
              onClick={() => setIsHovered(false)}
            >
              {feature.text}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AIChatBubble;