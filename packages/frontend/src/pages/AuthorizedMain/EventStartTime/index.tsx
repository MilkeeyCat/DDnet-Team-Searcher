import {CalendarIcon} from "../../../components/ui/Icons/Calendar"
import classNames from "classnames"
import { Run } from "@app/shared/types/Happenings.type";

interface EventStartTimeProps {
    startAt: string;
    status: Run["status"]; // I used here run.status even tho there're events
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
        <div className="flex items-center">
            <CalendarIcon
                color={status === 0 ? "var(--app-color)" : status === 1 ? "var(--app-green)" : status === 2 ? "red" : ""}/>
            <span className={classNames("text-[12px] ml-2.5 font-semibold text-[white]", {"text-success": status === 1})}>
                {status === 0 && `${startDateWithWeekday}th ∙ ${startTime}`}
                {status === 1 && `Happening Now`}
                {status === 2 && `Finished`}
            </span>
        </div>
    )
}