import { Run } from "@app/shared/types/Happenings.type";
import placeIcon from "../../../assets/images/run-place.svg"

interface OwnProps {
    place: Run["place"]; // I used here run.place even tho there're events interface as well
}

export const EventPlace:React.FC<OwnProps> = ({place}) => {
    return (
        <div className="run__place">
            <img src={placeIcon}/>
            <span>{place == 1 ? "Other place" : "Our servers"}</span>
        </div>
    )
}