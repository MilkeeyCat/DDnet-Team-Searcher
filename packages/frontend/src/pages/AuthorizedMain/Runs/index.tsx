import { useAppSelector } from "../../../utils/hooks/hooks";
import { Run } from "../Run";

export const Runs:React.FC<{onClick: (id: number)=>()=>void}> = ({onClick}) => {
    const runs = useAppSelector(state => state.happeningsReducer.runs)

    return (
        <div className="flex max-w-[1110px] mx-auto flex-wrap [&>*]:m-2.5">
            {runs && runs.map((run) => {
                return (
                    <Run onClick={onClick(run.id)} run={run} key={run.id}/>
                )
            })}
        </div>
    )
}