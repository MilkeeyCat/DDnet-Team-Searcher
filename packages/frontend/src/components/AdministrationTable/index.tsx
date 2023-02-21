import classNames from "classnames"
import { useEffect, useRef, useState } from "react"

type OwnProps = {
    binds: {
        [key: string]: {
            cb: (id: number, {field, value}: {field: string, value: any}) => void
        }
    },
    actions?: Array<{
        name: string,
        cb: (id: number) => void
    }>,
    data: Array<any>,
    className?: string
}

export const AdministrationTable = ({binds, data, actions, className}: OwnProps) => {
    return (
        <table className={classNames("w-full", {[className || ""]: classNames})}>
                <thead className="w-full">
                    <tr className="h-[50px]">
                        {Object.keys(binds).map((name) => (
                            <th className="px-4 text-high-emphasis text-left border-y-[1px] border-medium-emphasis">{name}</th>
                        ))}
                        <th className="px-4 text-high-emphasis text-left border-y-[1px] border-medium-emphasis">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data && data.map(row => (
                        <tr className="h-[50px]">
                            {Object.entries(row).map(([key, val]) => {
                                const [isEditModeEnabled, setIsEditModeEnabled] = useState(false)
                                const ref = useRef<HTMLTextAreaElement | null>(null)

                                const onBlur = () => {
                                    setIsEditModeEnabled(false)
                                    binds[key as any].cb(row.id, {field: key, value: ref.current?.value})
                                }

                                useEffect(() => {
                                    if(isEditModeEnabled) {
                                        if(ref.current) {
                                            ref.current.focus()
                                            ref.current.value = val as string
                                        }
                                    }
                                }, [isEditModeEnabled])

                                return (
                                    <>
                                        {isEditModeEnabled ?
                                            <td className="px-4 text-medium-emphasis border-y-[1px]">
                                                <textarea className="w-full h-full bg-primary-3 outline-0" onBlur={onBlur} ref={ref}/>
                                            </td>
                                            :
                                            <td className="px-4 text-medium-emphasis border-y-[1px]" onDoubleClick={()=>setIsEditModeEnabled(true)}>{val as any}</td>
                                        }
                                    </>
                                )    
                            })}
                    
                            { actions &&
                                <td className="px-4 text-medium-emphasis border-y-[1px]">
                                    {actions.map((action) => (
                                        <button className="bg-primary-1 mx-2 p-1 rounded-[5px]" onClick={()=>action.cb(row.id)}>{action.name}</button>
                                    ))}
                                </td>
                            }
                        </tr>
                    ))}
                </tbody>
        </table>
    )
}