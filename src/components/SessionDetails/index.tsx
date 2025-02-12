"use client";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { useState, useEffect, useCallback } from "react";
import SessionTimeline from "./session-timeline";
import ZKProofSection from "./zk-proof-section";
import SessionInteractionsList from "./session-interactions-list";
import api from "@/util/api";
import { Button } from "../ui/button";
import { RefreshCcw } from "lucide-react";
import {
    Interaction,
    ZkProof,
    SessionEvent,
    SessionUpdates,
    PaginationResult,
} from "@/types";

const queryClient = new QueryClient();

/** Utility to build the nested query object:
 *  events[page] = 2, events[limit] = 10, ...
 */
function constructNamespaceQueryObject(queryParams: QueryParams) {
    const result: Record<string, string | number> = {};
    Object.entries(queryParams).forEach(([key, value]) => {
        Object.entries(value).forEach(([paramKey, paramValue]) => {
            result[`${key}[${paramKey}]`] = paramValue;
        });
    });
    return Object.keys(result).length ? result : undefined;
}

// Utility to build the query object:
// events[page] = 2, events[limit] = 10, ...
function constructQueryObject(dto: FilterPaginationDto) {
    const queryParams: Record<string, string> = {};
    Object.entries(dto).forEach(([key, value]) => {
        if (value !== undefined) {
            queryParams[key] = value.toString();
        }
    });
    return queryParams;
}

// API fetchers
async function fetchEvents(sessionId: string, params: FilterPaginationDto) {
    const queryObj = constructQueryObject(params);
    const res = await api().get<PaginationResult<SessionEvent>>(
        `sessions/details/${sessionId}/events`,
        { params: queryObj }
    );
    return res.data;
}

async function fetchInteractions(sessionId: string, params: FilterPaginationDto) {
    const queryObj = constructQueryObject(params);
    const res = await api().get<PaginationResult<Interaction>>(
        `sessions/details/${sessionId}/interactions`,
        { params: queryObj }
    );
    return res.data;
}

async function fetchProofs(sessionId: string, params: FilterPaginationDto) {
    const queryObj = constructQueryObject(params);
    const res = await api().get<PaginationResult<ZkProof>>(
        `sessions/details/${sessionId}/proofs`,
        { params: queryObj }
    );
    return res.data;
}

// Types
export interface SessionDetailsChildrenProps<T> {
    data: PaginationResult<T>;
    onQueryChange: (query: FilterPaginationDto) => void;
    query: FilterPaginationDto;
}
interface SessionDetailsProps extends SessionUpdates {
    sessionId: string;
}

type FilterPaginationDto = {
    page?: number;
    limit?: number;
    filterBy?: string;
    filterValue?: string;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
};

enum QueryParamKey {
    events = "events",
    interactions = "interactions",
    proofs = "proofs",
}
type QueryParams = {
    [key in QueryParamKey]?: FilterPaginationDto;
};

const REFRESH_INTERVAL_MS = 10_000;

function SessionDetails({
    sessionId,
    // We'll feed these in as `placeholderData`
    events,
    interactions,
    proofs,
}: SessionDetailsProps) {
    const [eventsQuery, setEventsQuery] = useState<FilterPaginationDto>({});
    const [interactionsQuery, setInteractionsQuery] = useState<FilterPaginationDto>({});
    const [proofsQuery, setProofsQuery] = useState<FilterPaginationDto>({});

    // We can safely remove manual `refetch` calls in useEffect. 
    // React Query re-fetches automatically when the query key changes.
    const {
        data: eventsData,
        isFetching: isFetchingEvents,
        isError: isErrorEvents,
    } = useQuery({
        // Stringify to ensure stable comparison if the object changes deeply
        queryKey: ["sessionEvents", sessionId, JSON.stringify(eventsQuery)],
        queryFn: () => fetchEvents(sessionId, eventsQuery),
        placeholderData: events, // Instead of `initialData`
        staleTime: 0,            // Mark data as immediately stale so re-fetch occurs
    });

    const {
        data: interactionsData,
        isFetching: isFetchingInteractions,
        isError: isErrorInteractions,
    } = useQuery({
        queryKey: ["sessionInteractions", sessionId, JSON.stringify(interactionsQuery)],
        queryFn: () => fetchInteractions(sessionId, interactionsQuery),
        placeholderData: interactions,
        staleTime: 0,
    });

    const {
        data: proofsData,
        isFetching: isFetchingProofs,
        isError: isErrorProofs,
    } = useQuery({
        queryKey: ["sessionProofs", sessionId, JSON.stringify(proofsQuery)],
        queryFn: () => fetchProofs(sessionId, proofsQuery),
        placeholderData: proofs,
        staleTime: 0,
    });

    // Global refresh: call the combined endpoint to update all three data fields at once.
    const refreshAllData = useCallback(async () => {
        const queryParams: QueryParams = {
            events: eventsQuery,
            interactions: interactionsQuery,
            proofs: proofsQuery,
        };
        const qs = constructNamespaceQueryObject(queryParams);
        const res = await api().get<SessionUpdates>(`sessions/details/${sessionId}`, { params: qs });
        const combinedData = res.data;
    
        // Update the caches with the same query keys used in your useQuery hooks.
        queryClient.setQueryData(
            ["sessionEvents", sessionId, JSON.stringify(eventsQuery)],
            combinedData.events
        );
        queryClient.setQueryData(
            ["sessionInteractions", sessionId, JSON.stringify(interactionsQuery)],
            combinedData.interactions
        );
        queryClient.setQueryData(
            ["sessionProofs", sessionId, JSON.stringify(proofsQuery)],
            combinedData.proofs
        );
    }, [sessionId, eventsQuery, interactionsQuery, proofsQuery]);
    

    const [countdown, setCountdown] = useState(REFRESH_INTERVAL_MS / 1000);

    useEffect(() => {
        const timer = setInterval(() => {
          setCountdown(prevCountdown => {
            if (prevCountdown <= 1) {
              refreshAllData();
              return REFRESH_INTERVAL_MS / 1000;
            }
            return prevCountdown - 1;
          });
        }, 1000);
    
        // Clean up the interval on component unmount
        return () => clearInterval(timer);
      }, [refreshAllData]);
    

    const isFetching = isFetchingEvents || isFetchingInteractions || isFetchingProofs;
    const isError = isErrorEvents || isErrorInteractions || isErrorProofs;

    const currentEvents = eventsData ?? {
        data: [],
        total: 0,
        currentPage: 1,
        totalPages: 1,
    };
    const currentInteractions = interactionsData ?? {
        data: [],
        total: 0,
        currentPage: 1,
        totalPages: 1,
    };
    const currentProofs = proofsData ?? {
        data: [],
        total: 0,
        currentPage: 1,
        totalPages: 1,
    };

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
                    <Button
                        variant={isError ? "destructive" : "default"}
                        className="size-8"
                        onClick={() => {
                            setCountdown(REFRESH_INTERVAL_MS / 1000);
                            refreshAllData();
                        }}
                        disabled={isFetching}
                    >
                        <RefreshCcw
                            className={`${isFetching ? "animate-spin direction-reverse" : ""} w-5 h-5`}
                        />
                    </Button>
                </div>
            </div>

            <SessionTimeline
                onQueryChange={setEventsQuery}
                query={eventsQuery}
                data={currentEvents}
            />
            <SessionInteractionsList
                data={currentInteractions}
                onQueryChange={setInteractionsQuery}
                query={interactionsQuery}
            />
            <ZKProofSection
                data={currentProofs}
                onQueryChange={setProofsQuery}
                query={proofsQuery}
            />
        </div>
    );
}

function SessionDetailsWrapper(props: SessionDetailsProps) {
    return (
        <QueryClientProvider client={queryClient}>
            <SessionDetails {...props} />
        </QueryClientProvider>
    );
}

export default SessionDetailsWrapper;