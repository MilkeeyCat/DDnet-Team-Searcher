import { useAppSelector } from "../../../utils/hooks/hooks";
import { Run } from "../Run";
import "./styles.scss"

export const Runs:React.FC<{onClick: (id: string)=>()=>void}> = ({onClick}) => {
    const runs = useAppSelector(state => state.runsReducer.runs)

    return (
        <div className="runs">
            {runs && runs.map((run) => {
                return (
                    <Run onClick={onClick(run.id)} run={run} key={run.id}/>
                )
            })}
        </div>
    )
}