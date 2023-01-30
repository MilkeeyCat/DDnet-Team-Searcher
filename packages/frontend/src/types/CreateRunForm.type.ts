import { RunRequest } from "@app/shared/types/RunRequest.type";

export interface CreateRunForm extends Omit<RunRequest, "place"> {
    place: RunRequest["place"] | null;
}