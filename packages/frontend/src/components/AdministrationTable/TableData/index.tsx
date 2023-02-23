import { useEffect, useRef, useState } from "react"
import { BindsT } from "../types"

type OwnProps = {
    value: string | number | null,
    binds: BindsT,
    keyProperty: string,
    row: any;
}

export const TableData = ({value, binds, keyProperty, row}: OwnProps) => {
    const [isEditModeEnabled, setIsEditModeEnabled] = useState(false)
    const ref = useRef<HTMLTextAreaElement | null>(null)
    
    const onBlur = () => {
        setIsEditModeEnabled(false)
        binds[keyProperty as any].cb(row.id, {field: keyProperty, value: ref.current?.value || ""})
    }
    
    useEffect(() => {
        if(isEditModeEnabled) {
            if(ref.current) {
                ref.current.focus()
                ref.current.value = value as string
            }
        }
    }, [isEditModeEnabled, ref])
    
    return (
        <td className="px-4 text-medium-emphasis border-y-[1px]" onDoubleClick={isEditModeEnabled ? ()=>{} : ()=>setIsEditModeEnabled(true)}>
            { !isEditModeEnabled ? 
                value as string 
                :
                <textarea className="w-full h-full bg-primary-3 outline-0" onBlur={onBlur} ref={ref}/>
            }
        </td>
    )    
}