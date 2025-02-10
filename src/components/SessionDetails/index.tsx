"use client";
import SessionTimeline from "./session-timeline";
import ZKProofSection from "./zk-proof-section";
import SessionInteractionsList from "./session-interactions-list";

import { useCallback, useEffect, useRef, useState } from "react";
import api from "@/util/api";
import { Button } from "../ui/button";
import { RefreshCcw } from "lucide-react";
import { Interaction, ZkProof, SessionEvent, SessionUpdates } from "@/types";

interface SessionDetailsProps extends SessionUpdates {
    sessionId: string;
}

export default function SessionDetails({
    sessionId,
    events,
    interactions,
    proofs,
}: SessionDetailsProps) {
    const [currentInteractions, setCurrentInteractions] =
        useState<Interaction[]>(interactions || []);
    const [currentSessions, setCurrentSessions] =
        useState<SessionEvent[]>(events || []);
    const [currentZkProofs, setCurrentZkProofs] = useState<ZkProof[]>(proofs || []);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const refreshInterval = 10;
    const [countdown, setCountdown] = useState<number>(refreshInterval);

    // A ref to always have access to the latest `loading` value in the timer callback.
    const loadingRef = useRef(loading);
    useEffect(() => {
        loadingRef.current = loading;
    }, [loading]);

    const handleSessionUpdate = useCallback(async () => {
        // When an update is triggered reset the countdown.
        setLoading(true);
        setError(null);

        try {
            const res = await api().get<SessionUpdates>(`sessions/session-details/${sessionId}/updates`);
            const data = res.data;
            setCurrentInteractions(data.interactions);
            setCurrentSessions(data.events);
            setCurrentZkProofs(data.proofs);
        } catch (err) {
            console.error("Error fetching session updates:", err);
            setError("Failed to update session details.");
        } finally {
            setLoading(false);
            setCountdown(refreshInterval);
        }
    }, [sessionId, refreshInterval]);

    // Timer effect: decrement the countdown every second.
    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prevCountdown) => {
                // If the countdown is at 1, then on the next tick it should trigger an update.
                if (prevCountdown <= 1) {
                    if (!loadingRef.current) {
                        handleSessionUpdate();
                    }
                    return refreshInterval;
                }
                return prevCountdown - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [handleSessionUpdate, refreshInterval]);

    return (

        <div className="space-y-8">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-stone-600 text-3xl font-bold">
                    Session {sessionId} Details
                </h1>
                <div className="flex items-center gap-2 font-light">
                    <p className="text-sm inline-flex items-center gap-2 text-stone-500 w-5">
                        {countdown}s
                    </p>
                    <Button variant={error ? "destructive" : "default"} className="size-8" onClick={handleSessionUpdate} disabled={loading}>
                        <RefreshCcw className={`${loading ? "animate-spin direction-reverse" : ""} w-5 h-5`} />
                    </Button>
                </div>
            </div>

            <SessionTimeline events={currentSessions} />
            <SessionInteractionsList
                allActions={interactions}
                actions={currentInteractions}
                currentPage={0}
                totalPages={0}
                onPageChange={() => { }}
            />
            <ZKProofSection proofs={currentZkProofs} />
        </div>
    );
}
