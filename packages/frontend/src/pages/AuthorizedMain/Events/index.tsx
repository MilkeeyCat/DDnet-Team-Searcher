import { useAppSelector } from "../../../utils/hooks/hooks"
import {Event} from "../Event"

export const Events:React.FC<{onClick: (id: number)=>()=>void}> = ({onClick}) => {
    const events = useAppSelector(state => state.happeningsReducer.events)

    return (
        <div className="flex max-w-[1110px] mx-auto flex-wrap [&>*]:m-2.5">
            {events && events.map((event: any) => {
                return (
                    <Event onClick={onClick(event.id)} event={event} key={event.id}/>
                )
            })}
        </div>
    )
}