import placeIcon from "../../../assets/images/run-place.svg"

interface OwnProps {
    place: string;
}

export const EventPlace:React.FC<OwnProps> = ({place}) => {
    return (
        <div className="run__place">
            <img src={placeIcon}/>
            <span>{place == "1" ? "Other place" : "Our servers"}</span>
        </div>
    )
}