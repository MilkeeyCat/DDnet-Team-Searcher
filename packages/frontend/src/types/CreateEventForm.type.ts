import { EventRequest } from "@app/shared/types/EventRequest.type";

export interface CreateEventForm extends Omit<EventRequest, "place"> {
    place: EventRequest["place"] | null;
}