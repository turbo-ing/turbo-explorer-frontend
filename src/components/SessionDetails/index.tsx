"use client";
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { useState, useEffect } from "react";
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

const REFRESH_INTERVAL_MS = 10 * 1000;


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
    sortOrder?: 'ASC' | 'DESC';
};

enum QueryParamKey {
    events = "events",
    interactions = "interactions",
    proofs = "proofs",
}
type QueryParams = {
    [key in QueryParamKey]?: FilterPaginationDto;
}

const constructQueryParams = (queryParams: QueryParams) => {
    const queryURL = new URLSearchParams();

    Object.entries(queryParams).forEach(([key, value]) => {
        Object.entries(value).forEach(([paramKey, paramValue]) => {
            queryURL.append(`${key}[${paramKey}]`, paramValue.toString());
        });
    });

    if (queryURL.toString() === "") {
        return undefined;
    }
    return queryURL;
}

// API fetchers that gets the latest session updates

const fetchEvents = async (sessionId: string, params: FilterPaginationDto): Promise<PaginationResult<SessionEvent>> => {
    const qs = constructQueryParams({ events: params });
    const res = await api().get<PaginationResult<SessionEvent>>(`sessions/details/${sessionId}/events`, { params: qs });
    return res.data;
};

const fetchInteractions = async (sessionId: string, params: FilterPaginationDto): Promise<PaginationResult<Interaction>> => {
    const qs = constructQueryParams({ interactions: params });
    const res = await api().get<PaginationResult<Interaction>>(`sessions/details/${sessionId}/interactions`, { params: qs });
    return res.data;
};

const fetchProofs = async (sessionId: string, params: FilterPaginationDto): Promise<PaginationResult<ZkProof>> => {
    const qs = constructQueryParams({ proofs: params });
    const res = await api().get<PaginationResult<ZkProof>>(`sessions/details/${sessionId}/proofs`, { params: qs });
    return res.data;
};

function SessionDetails({
    sessionId,
    events,
    interactions,
    proofs,
}: SessionDetailsProps) {
    // Use SSR data as initial query data.
    // Set the refetch interval to 10 seconds.

    const [eventsQuery, setEventsQuery] = useState<FilterPaginationDto>({});
    const [interactionsQuery, setInteractionsQuery] = useState<FilterPaginationDto>({});
    const [proofsQuery, setProofsQuery] = useState<FilterPaginationDto>({});


    // Use TanStack Query with initialData so that the SSR data is available immediately.
    const {
        data: eventsData,
        refetch: refetchEvents,
        isFetching: isFetchingEvents,
        isError: isErrorEvents,
    } = useQuery(
        {
            queryKey: ["sessionEvents", sessionId, eventsQuery],
            queryFn: () => fetchEvents(sessionId, eventsQuery),
            initialData: events
        }
    );

    useEffect(() => {
        refetchEvents();
        console.log("refetching events with query", eventsQuery);
    }, [eventsQuery, refetchEvents]);

    const {
        data: interactionsData,
        refetch: refetchInteractions,
        isFetching: isFetchingInteractions,
        isError: isErrorInteractions,
    } = useQuery(
        {
            queryKey: ["sessionInteractions", sessionId, interactionsQuery],
            queryFn: () => fetchInteractions(sessionId, interactionsQuery),
            initialData: interactions
        }
    );

    useEffect(() => {
        refetchInteractions();
    }, [interactionsQuery, refetchInteractions]);

    const {
        data: proofsData,
        refetch: refetchProofs,
        isFetching: isFetchingProofs,
        isError: isErrorProofs,
    } = useQuery(
        {
            queryKey: ["sessionProofs", sessionId, proofsQuery],
            queryFn: () => fetchProofs(sessionId, proofsQuery),
            initialData: proofs
        }
    );

    useEffect(() => {
        refetchProofs();
    }, [proofsQuery, refetchProofs]);

    const isFetching = isFetchingEvents || isFetchingInteractions || isFetchingProofs;

    const isError = isErrorEvents || isErrorInteractions || isErrorProofs;

    // Global refresh: call the combined endpoint to update all three data fields at once.
    // This endpoint accepts parameters for each field.
    const refreshAllData = async () => {
        // Build the query string using the current pagination/filter parameters.
        console.log("Refreshing all data");
        const queryParams: QueryParams = {
            events: eventsQuery,
            interactions: interactionsQuery,
            proofs: proofsQuery,
        };
        const qs = constructQueryParams(queryParams,);
        const res = await api().get<SessionUpdates>(`sessions/details/${sessionId}`, { params: qs });
        const combinedData = res.data;

        // Update each individual query's cache with the new data.
        queryClient.setQueryData(["sessionEvents", sessionId, eventsQuery], combinedData.events);
        queryClient.setQueryData(["sessionInteractions", sessionId, interactionsQuery], combinedData.interactions);
        queryClient.setQueryData(["sessionProofs", sessionId, proofsQuery], combinedData.proofs);
    };

    // Refresh the data every 10 seconds.
    useEffect(() => {
        const timer = setInterval(() => {
            refreshAllData();
        }, REFRESH_INTERVAL_MS);
        return () => clearInterval(timer);
    }, []);

    // Countdown the refresh interval. For coutdown UI component.
    const [countdown, setCountdown] = useState(REFRESH_INTERVAL_MS / 1000);
    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => (prev <= 1 ? REFRESH_INTERVAL_MS / 1000 : prev - 1));
        }, 1000);
        return () => clearInterval(timer);
    }, [REFRESH_INTERVAL_MS]);


    // Extract the paginated data for each section, providing defaults if needed.
    const currentEvents: PaginationResult<SessionEvent> =
        eventsData || { data: [], total: 0, currentPage: 1, totalPages: 1 };
    const currentInteractions: PaginationResult<Interaction> =
        interactionsData || { data: [], total: 0, currentPage: 1, totalPages: 1 };
    const currentProofs: PaginationResult<ZkProof> =
        proofsData || { data: [], total: 0, currentPage: 1, totalPages: 1 };

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
                            refreshAllData()}
                        }
                        disabled={isFetching}
                    >
                        <RefreshCcw
                            className={`${isFetching ? "animate-spin direction-reverse" : ""
                                } w-5 h-5`}
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

const queryClient = new QueryClient();

function SessionDetailsWrapper(props: SessionDetailsProps) {
    return (
        <QueryClientProvider client={queryClient}>
            <SessionDetails {...props} />
        </QueryClientProvider>
    );
}

export default SessionDetailsWrapper;