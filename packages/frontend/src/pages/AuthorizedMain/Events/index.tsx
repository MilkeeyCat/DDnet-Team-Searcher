import { useAppSelector } from "../../../utils/hooks/hooks"
import {Event} from "../Event"
import "./styles.scss"

export const Events:React.FC<{onClick: (id: string)=>()=>void}> = ({onClick}) => {
    const events = useAppSelector(state => state.eventsReducer.events)

    return (
        <div className="events">
            {events && events.map((event: any) => {
                return (
                    <Event onClick={onClick(event.id)} event={event} key={event.id}/>
                )
            })}
        </div>
    )
}