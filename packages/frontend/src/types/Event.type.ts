export interface Event {
    id: string;
    map_name: string;
    author_id: string;
    place: string;
    teamsize: number;
    start_at: string;
    username: string;
    avatar: string | null;
    description: string | null;
    status: "0" | "1" | "2";
    is_interested: "0" | "1";
    interested: string;
    connect_string?: string;
    end_at: string | null;
    thumbnail: string | null;
}