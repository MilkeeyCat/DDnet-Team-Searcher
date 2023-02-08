import { Run as RunType } from "@app/shared/types/Happenings.type"
import { Run } from "../../AuthorizedMain/Run"

interface OwnProps {
    runs: Array<RunType>
}

export const Runs = ({runs}: OwnProps) => {
    return (
        <div>
            {runs.map(run => (
                <Run run={run} onClick={()=>{}}/>
            ))}        
        </div>
    )
}