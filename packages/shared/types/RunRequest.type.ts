export interface RunRequest {
    place: "0" | "1";
    mapName: string;
    teamSize: string;
    runStartDate: string;
    runStartTime: string;
    description: string;
}