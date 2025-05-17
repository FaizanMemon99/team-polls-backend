export interface CreatePollRequestBody {
  question: string;
  options: string[];
  expiresAt: string;
}

export interface CastVoteRequestBody {
  option: string;
}
