import { Run } from "@app/shared/types/Happenings.type";
import placeIcon from "../../../assets/images/run-place.svg"

interface OwnProps {
    place: Run["place"]; // I used here run.place even tho there're events interface as well
}

export const EventPlace:React.FC<OwnProps> = ({place}) => {
    return (
        <div className="flex items-center font-semibold mt-2.5">
            <img src={placeIcon}/>
            <span className="ml-2.5 text-medium-emphasis text-[12px]">{place == 1 ? "Other place" : "Our servers"}</span>
        </div>
    )
}