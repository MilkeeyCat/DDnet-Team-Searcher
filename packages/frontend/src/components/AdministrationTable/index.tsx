import classNames from "classnames"
import { TableData } from "./TableData"
import { ActionT, BindsT } from "./types"


type OwnProps<T extends BindsT, P extends ActionT> = {
    binds: T,
    actions?: Array<P>,
    data: Array<{[key in keyof T]: string | number | null}>,
    className?: string
}

export const AdministrationTable = <T extends BindsT, P extends ActionT>({binds, data, actions, className}: OwnProps<T, P>) => {
    return (
        <table className={classNames("w-full", {[className || ""]: classNames})}>
                <thead className="w-full">
                    <tr className="h-[50px]">
                        {Object.keys(binds).map((name, index) => (
                            <th key={index} className="px-4 text-high-emphasis text-left border-y-[1px] border-medium-emphasis">{name}</th>
                        ))}
                        <th className="px-4 text-high-emphasis text-left border-y-[1px] border-medium-emphasis">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data && data.map((row, index) => (
                        <tr className="h-[50px]" key={index}>
                             {Object.entries(row).map(([key, val], index) => (
                                <TableData binds={binds} value={val} key={index} row={row} keyProperty={key}/>
                             ))}
                    
                            { actions &&
                                <td className="px-4 text-medium-emphasis border-y-[1px]">
                                    {actions.map((action, index) => (
                                        <button key={index} className="bg-primary-1 mx-2 p-1 rounded-[5px]" onClick={()=>action.cb(row)}>{action.name}</button>
                                    ))}
                                </td>
                            }
                        </tr>
                    ))}
                </tbody>
        </table>
    )
}