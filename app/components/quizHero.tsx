"use client";
import React from 'react';
import Image from 'next/image';
import Pbtn from './buttons/primarybtn';
import ShareButton from './buttons/sharebtn';

function QuizHero({ currentLevel }: { currentLevel: number }) {
  const nextLevel = Math.min(currentLevel + 1, 10); // Prevents going past last level (assume 10)

  return (
    <div>
      <div className="container mx-auto px-4 py-16 mt-10 bg-white">
        <div className="flex flex-col md:flex-row items-center">
          {/* Text Section */}
          <div className="md:w-1/2 space-y-6 text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-800">
              Level Up Your Job Search with Guhuza’s Brain Boost
            </h1>

            <p className="text-gray-600 text-lg">
              A fun and interactive way to sharpen your skills, earn rewards,
              and stand out in your career journey. Compete, learn, and win as
              you take your job search to the next level!
            </p>

            {/* Buttons */}
            <div className="flex justify-center md:justify-start space-x-4">
              <Pbtn message="Start Quiz" toDestination={`quiz/${currentLevel}`} theme="dark" />
              <ShareButton />
            </div>
          </div>

          {/* Image Section */}
          <div className="mt-8 md:mt-0 md:w-1/2 flex justify-center">
            <Image
              src="/Images/herosection/heroimage.webp"
              alt="A person giving an interview and smiling"
              className="rounded-md shadow-lg w-full hidden lg:max-w-lg md:block"
              width={500}
              height={300}
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizHero;
