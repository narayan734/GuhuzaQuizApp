"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SetUsernamePage() {
  const { data: session } = useSession();
  const [username, setUsername] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!username.trim()) return;

  setIsSaving(true);

  const payload = {
    playerId: session?.user?.memberId,
    newName: username,
  };

  console.log("🔁 Sending:", payload); // ✅ check in browser console

  const res = await fetch("/api/player/setname", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await res.json();
  console.log("🟢 Server response:", result); // ✅ log server response

  if (result.success) {
    router.push("/profile");
  }

  setIsSaving(false);
};



 

  return (
    <div className="max-w-md mx-auto mt-16 p-4 border rounded bg-white shadow">
      <h1 className="text-xl font-bold mb-4">Set Your Username</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="w-full p-2 border rounded mb-4"
          placeholder="Enter your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button
          type="submit"
          disabled={isSaving}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          {isSaving ? "Saving..." : "Save Name"}
        </button>
      </form>
    </div>
  );
}
