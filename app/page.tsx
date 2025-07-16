"use client";

import { useSession } from "next-auth/react";
import LoginButton from "./components/buttons/loginBtn";
import LogoutButton from "./components/buttons/logoutBtn";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const [playerName, setPlayerName] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getPlayer = async (memberId: number) => {
      const res = await fetch(`/api/player/${memberId}`);
      if (res.ok) {
        const data = await res.json();
        if (data?.Player_name && data.Player_name.toLowerCase() !== "anonymous") {
          setPlayerName(data.Player_name);
        } else {
          // redirect only if local name is still anonymous
          router.push("/set-username");
        }
      }
    };

    if (session?.user?.memberId) {
      getPlayer(session.user.memberId);
    }
  }, [session, router]);

  if (status === "authenticated" && session?.user) {
  const defaultName = session.user.firstName || "Anonymous";
  const name = playerName || defaultName;


    return (
      <div className="flex h-full"
        style={{
          backgroundImage: "linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)",
        }}
      >
        <div className="px-8 my-32 rounded py-8 border-2 mx-auto w-fit bg-white">
          <h1 className="title mb-5 w-32">Welcome</h1>
          <p>Hello, {name}</p>
          <p>You are already logged in. If you want to log into another account, please logout.</p>
          <div className="mt-5 w-full">
            <LogoutButton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <div className="px-8 my-32 rounded py-8 border-2 mx-auto w-fit bg-white">
        <h1 className="title mb-5 w-32">Log in</h1>
        <p>Welcome to Guhuza’s Brain Boost. Login is handled by Guhuza.</p>
        <div className="mt-5 w-full">
          <LoginButton />
        </div>
      </div>
    </div>
  );
}


