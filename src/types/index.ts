export interface ZkProof {
  id: string;
  peer_id: string;
  proof: string;
  verification_key: string;
  recent_blob_pull: bigint;
}

export interface ErrorResponse {
  message: string;
  status?: number;
}

export interface Interaction {
  id: string;
  session_id: string;
  peer_id: string;
  body: string;
  created_at: string;
  recent_blob_pull: bigint;
}

export interface Game {
  id: number;
  name: string;
  description: string;
  icon?: string;
  domain_name: string;
  game_id: string;
  verification_key: string;
  session_count: number;
  interaction_count: number;
  slug: string;
  created_at: Date;
  updated_at: Date;
  recent_blob_pull: bigint;
}

export interface Session {
  id: number;
  app_id: number;
  session_id: string;
  topic: string;
  interaction_count: number;
  created_at: Date;
  updated_at: Date;
  recent_blob_pull: bigint;
}

export interface SessionEvent {
  id: number;
  session_id: number;
  peer_id: string;
  event: string;
  created_at: Date;
  recent_blob_pull: bigint;
}

interface BaseSessionData {
  events: PaginationResult<SessionEvent>;
  interactions: PaginationResult<Interaction>;
  proofs: PaginationResult<ZkProof>;
}

export interface SessionDetails extends BaseSessionData {
  session: Session;
  appData: Game;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SessionUpdates extends BaseSessionData {}

export interface PaginationResult<T> {
  data: T[];
  total: number;
  currentPage: number;
  totalPages: number;
}
