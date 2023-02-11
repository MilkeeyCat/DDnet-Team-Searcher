import { APIResponse } from "@app/shared/types/APIResponse.type.js"
import { InterestedPlayer } from "../InterestedPlayer.type"
import { RunRequest } from "../RunRequest.type";
import { EventRequest } from "../EventRequest.type";
import { Run, Event } from "../Happenings.type.js"

export type GetAllRunsResponse = APIResponse<"SUCCESS", Array<Run>>

export type CreateRunResponse = APIResponse<"RUN_CREATION_FAILED" | "RUN_CREATED_SUCCESSFULLY", {
    field: keyof RunRequest;
    text: string;
} | string>

export type UpdateRunResponse = APIResponse<"RUN_UPDATING_FAILED" | "RUN_UPDATED_SUCCESSFULLY", {
    field: keyof RunRequest;
    text: string;
} | string>

export type UpdateEventResponse = APIResponse<"EVENT_UPDATING_FAILED" | "EVENT_UPDATED_SUCCESSFULLY" | "ERROR_OCCURED", {
    field: keyof EventRequest;
    text: string;
} | string>

export type GetAllEventsResponse = APIResponse<"SUCCESS", Array<Event>>

export type CreateEventResponse = APIResponse<"EVENT_CREATION_FAILED" | "EVENT_CREATED_SUCCESSFULLY", {
    field: keyof EventRequest;
    text: string;
} | string>

export type StartHappeningResponse = APIResponse<"HAPPENING_NOT_FOUND" | "PERMISSION_DENIED" | "HAPPENING_STARTED_SUCCESSFULLY">

export type EndHappeningResponse = APIResponse<"HAPPENING_NOT_FOUND" | "PERMISSION_DENIED" | "HAPPENING_ENDED_SUCCESSFULLY">

export type DeleteHappeningResponse = APIResponse<"HAPPENING_DELETED_SUCCESSFULLY" | "ERROR_OCCURED", string>

export type SetInterestedResponse = APIResponse<"SET_INTERESTED_SUCCESSFULLY" | "SET_INTERESTED_FAILED", boolean>

export type InterestedPlayersResponse = APIResponse<"SUCCESS", Array<InterestedPlayer>>

export type AddOrRemoveFromTeamResponse = APIResponse<"SUCCESS", 1 | 0>