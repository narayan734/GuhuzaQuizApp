"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { levels } from "@/lib/db";

export default function SharePopup({ score, player, levelTitle, buttonClass = "", totalScore = 0, correct = 0 }) {
  const [isOpen, setIsOpen] = useState(false);

  // Construct shareable link to /share?score=...&level=...&badge=...&correct=...
  const baseUrl = "https://guhuza.com"; // ✅ Replace with your live domain

const shareLink = `${baseUrl}`;

const shareText = `Hey I just play Guhuza Quiz on its website and  just scored ${score} in ${levelTitle}! Can you beat me? 🔥`;

const encodedText = encodeURIComponent(`${shareText}\n\nPlay now: ${shareLink}`);


  return (
    <div>
      <button onClick={() => setIsOpen(true)} className={buttonClass}>
        Share Score
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="bg-white text-black rounded-2xl p-6 w-80 relative"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-black text-lg"
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold text-center mb-4">Share Your Score</h2>
            <p className="text-center mb-4 whitespace-pre-line">{shareText}</p>
            <motion.div
              className="flex flex-col gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <a
                href={`https://twitter.com/intent/tweet?text=${encodedText}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full border border-black text-black py-2 rounded-lg">
                  Share on Twitter
                </motion.button>
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full border border-black text-black py-2 rounded-lg">
                  Share on Facebook
                </motion.button>
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareLink)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full border border-black text-black py-2 rounded-lg">
                  Share on LinkedIn
                </motion.button>
              </a>
              <a
                href={`https://wa.me/?text=${encodedText}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full border border-black text-black py-2 rounded-lg">
                  Share on WhatsApp
                </motion.button>
              </a>
            </motion.div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
