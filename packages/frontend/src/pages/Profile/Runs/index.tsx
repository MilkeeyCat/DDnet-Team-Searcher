import { Run as RunType } from "../../../types/Run.type"
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