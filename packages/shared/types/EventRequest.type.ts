export interface EventRequest {
    place: "0" | "1";
    mapName: string;
    teamSize: string;
    eventStartDate: string;
    eventStartTime: string;
    eventEndDate?: string;
    eventEndTime?: string;
    description: string;
    thumbnail?: File | string;
}