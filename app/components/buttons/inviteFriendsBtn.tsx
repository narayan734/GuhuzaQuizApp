"use client";

import { useState, useRef, useEffect } from "react";
import { FaUserPlus, FaWhatsapp, FaFacebookMessenger } from "react-icons/fa";

const InviteFriendsBtn = ({ playerId }: { playerId: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  const referralLink = `${typeof window !== "undefined" ? window.location.origin : ""}/signup?ref=${playerId}`;
  const message = `Join me on Guhuza Quiz and earn rewards! 🧠 Here's my invite link: ${referralLink}`;
  const encodedMessage = encodeURIComponent(message);
  const encodedURL = encodeURIComponent(referralLink);

  const handleInviteAndOpen = async (url: string) => {
    try {
      await fetch("/api/reward", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId, action: "invite" }),
      });
      console.log("✅ Invite recorded");
      window.open(url, "_blank");
    } catch (err) {
      console.error("❌ Failed to send invite", err);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block mt-4" ref={popupRef}>
      {/* Invite Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow hover:bg-blue-700 transition"
      >
        <FaUserPlus /> Invite
      </button>

      {/* Dropdown Popup */}
      {isOpen && (
        <div className="absolute top-12 right-0 bg-white shadow-lg rounded-lg p-3 w-56 z-50">
          <p className="text-sm text-gray-700 mb-2">Invite your friends:</p>
          <div className="flex flex-col space-y-2">
            <button
              onClick={() =>
                handleInviteAndOpen(
                  `https://api.whatsapp.com/send?text=${encodedMessage}`
                )
              }
              className="flex items-center gap-2 text-green-600 hover:underline"
            >
              <FaWhatsapp /> WhatsApp
            </button>
            <button
              onClick={() =>
                handleInviteAndOpen(
                  `https://www.facebook.com/dialog/send?link=${encodedURL}&app_id=YOUR_FB_APP_ID&redirect_uri=${encodedURL}`
                )
              }
              className="flex items-center gap-2 text-blue-600 hover:underline"
            >
              <FaFacebookMessenger /> Messenger
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InviteFriendsBtn;
