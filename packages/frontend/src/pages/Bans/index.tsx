import { AdministrationUpdateBanInfo } from "@app/shared/types/api/administration.type"
import { useEffect, useState } from "react"
import { useDeleteBanMutation, useGetBansQuery, useUpdateBanMutation } from "../../api/administration-api"
import { AdministrationTable } from "../../components/AdministrationTable"
import { hint } from "../../store/slices/hints"
import { useAppDispatch } from "../../utils/hooks/hooks"

export const Bans = () => {
    const {data: bans, isSuccess, refetch} = useGetBansQuery()
    const [binds, setBinds] = useState<any>()
    const [updateBan] = useUpdateBanMutation()    
    const [deleteBan] = useDeleteBanMutation()    
    const dispatch = useAppDispatch()

    useEffect(() => {
        if(bans && bans.length) {
            const obj: {[key: string]: {cb: (...args: Array<any>) => Promise<void>}} = {}

            Object.keys(bans[0]).map(el => {
                obj[el] = {
                    cb: async (id: number, {field, value}) => {
                        try {
                            const res = await updateBan({banId: id, data: {[field]: value}}).unwrap()

                            dispatch(hint({type: "success", text: res.data || ""}))
                            refetch()
                        } catch(e) {
                            const err = e as AdministrationUpdateBanInfo
                 
                            if(typeof err === "object") {
                                if("data" in err) {
                                    if(typeof err.data === "string") {
                                        dispatch(hint({type: "error", text: err.data || ""}))
                                    }
                                }
                            }
                        }
                    }
                }
            })

            setBinds(obj)
        }
    }, [isSuccess])

    const actions = [
        {
            name: "Unban",
            cb: async ({id}: Exclude<typeof bans, string | undefined>[number]) => {
                try {
                    const res = await deleteBan(id).unwrap()

                    dispatch(hint({type: "success", text: res.data || ""}))
                    refetch()
                } catch(e) {
                    const err = e as AdministrationUpdateBanInfo
         
                    if(typeof err === "object") {
                        if("data" in err) {
                            if(typeof err.data === "string") {
                                dispatch(hint({type: "error", text: err.data || ""}))
                            }
                        }
                    }
                }
            }
        }
    ]

    return (
        <div className="max-w-[1110px] mx-auto">
            <h1 className="text-high-emphasis text-3xl mt-20">Sooo eh... Yea</h1>
            <h2 className="text-medium-emphasis">Here you can edit bans, you can unban ppl and chnage some thing just double click</h2>

            {binds && bans && <AdministrationTable binds={binds} data={bans as Exclude<typeof bans, string>} actions={actions} className="mt-10" />}
            {!binds &&
                <h3 className="text-medium-emphasis text-2xl mt-10 text-center">Seems like there's no anything to edit :thonk:</h3>
            }
        </div>
    )
}