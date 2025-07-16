"use client";

import { useState, useRef, useEffect } from "react";
import {
  FaShareAlt,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaWhatsapp,
} from "react-icons/fa";

type Props = {
  rank: number;
  points: number;
};

const ShareProfileBtn = ({ rank, points }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  const websiteUrl = "http://localhost:3000/profile";
  const message = `I am at Rank ${rank} with ${points} points on Guhuza Quiz! 🎯`;
  const encodedMessage = encodeURIComponent(message);
  const encodedURL = encodeURIComponent(websiteUrl);

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block mt-4">
      {/* Share Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white text-black font-semibold border border-gray-300 rounded-lg shadow hover:shadow-md transition"
      >
        <FaShareAlt /> Share
      </button>

      {/* Share Popup */}
      {isOpen && (
        <div
          ref={popupRef}
          className="absolute top-12 right-0 bg-white shadow-lg rounded-lg p-3 w-52 z-50"
        >
          <p className="text-sm text-gray-700 mb-2">Share your profile:</p>
          <div className="flex flex-col space-y-2">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodedURL}&quote=${encodedMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-700 hover:underline"
            >
              <FaFacebook /> Facebook
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodedURL}&text=${encodedMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-400 hover:underline"
            >
              <FaTwitter /> Twitter (X)
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedURL}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:underline"
            >
              <FaLinkedin /> LinkedIn
            </a>
            <a
              href={`https://api.whatsapp.com/send?text=${encodedMessage} ${websiteUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-green-600 hover:underline"
            >
              <FaWhatsapp /> WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareProfileBtn;
