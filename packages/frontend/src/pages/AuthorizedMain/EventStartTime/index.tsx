import {CalendarIcon} from "../../../components/ui/Icons/Calendar"
import classNames from "classnames"

interface EventStartTimeProps {
    startAt: string;
    status: "0" | "1" | "2"
}

export const EventStartTime: React.FC<EventStartTimeProps> = ({startAt, status}) => {
    const startDateWithWeekday = new Date(startAt).toLocaleDateString([], {
        month: "short",
        weekday: "short",
        day: "numeric",
    }) // for example Fri, Sep 21

    const startTime = new Date(startAt).toLocaleTimeString([], {
        timeStyle: "short",
        hour12: false
    }) // for example 5:24 pm

    return (
        <div className="run__start-at">
            <CalendarIcon
                color={status === "0" ? "var(--app-color)" : status === "1" ? "var(--app-green)" : status === "2" ? "red" : ""}/>
            <span className={classNames("run__time", {"run__time_happening": status === "1"})}>
                {status === "0" && `${startDateWithWeekday}th ∙ ${startTime}` /* event didnt start */}
                {status === "1" && `Happening Now` /* happening right now */}
                {status === "2" && `Finished` /* happening right now */}
            </span>
        </div>
    )
}