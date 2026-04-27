import { apiGet } from "./http";
import type {
  PageResult,
  TeamMemberQueryRequest,
  TeamMemberResponse,
  TeamSummaryResponse,
} from "./types";

export type { TeamMemberQueryRequest, TeamMemberResponse, TeamSummaryResponse };

export const getTeamSummary = () =>
  apiGet<TeamSummaryResponse>("/api/team/summary");

export const getTeamMembers = (params: TeamMemberQueryRequest = {}) =>
  apiGet<PageResult<TeamMemberResponse>>("/api/team/members", { params });
