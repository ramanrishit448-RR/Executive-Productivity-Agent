"use client";

import React, { useState } from "react";
import ChatPanel from "@/components/dashboard/chat-panel";
import { Sparkles } from "lucide-react";
import { useUser, useSession, useAuth, SignInButton, UserButton } from "@clerk/nextjs";

export default function DashboardPage() {
  const [anchorDate, setAnchorDate] = useState<string>("2026-09-23");
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const { signOut } = useAuth();
  const { user, isLoaded, isSignedIn } = useUser();
  const { session } = useSession();

  if (!isLoaded) {
    return <div className="flex min-h-screen items-center justify-center bg-neu-base text-sm text-text-muted font-inter">Loading session...</div>;
  }

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetch(`/api/brief?date=${anchorDate}`);
    } finally {
      setTimeout(() => setIsRefreshing(false), 300);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neu-base font-inter">
        <div className="text-center space-y-6 max-w-sm p-8 card-neu">
          <div className="h-14 w-14 mx-auto rounded-full card-neu-pressed flex items-center justify-center text-accent-dark">
            <Sparkles className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-text-main tracking-tight">Authentication Required</h2>
            <p className="text-sm text-text-muted mt-2">
              Please sign in to access the Executive Productivity Agent.
            </p>
          </div>
          <SignInButton mode="modal">
            <button className="btn-neu w-full py-3.5 text-base font-medium active:scale-95">
              Sign in with Clerk
            </button>
          </SignInButton>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-neu-base text-text-main antialiased font-inter overflow-hidden">
      <div className="h-full w-full">
        <ChatPanel
          sessionToken={session?.id ?? ""}
          anchorDate={anchorDate}
          setAnchorDate={setAnchorDate}
          isRefreshing={isRefreshing}
          onRefresh={handleRefresh}
        />
      </div>
    </div>
  );
}

