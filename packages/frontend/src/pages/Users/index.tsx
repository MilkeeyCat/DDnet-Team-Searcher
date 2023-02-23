import { AdministrationUpdateBanInfo, AdministrationUpdateReport } from "@app/shared/types/api/administration.type"
import { useEffect, useState } from "react"
import { useDeleteUserMutation, useGetUsersQuery, useUpdateUserMutation } from "../../api/administration-api"
import { AdministrationTable } from "../../components/AdministrationTable"
import { hint } from "../../store/slices/hints"
import { useAppDispatch } from "../../utils/hooks/hooks"

export const Users = () => {
    const {data: users, isSuccess, refetch} = useGetUsersQuery()
    const [binds, setBinds] = useState<any>()
    const [updateUser] = useUpdateUserMutation()    
    const [deleteUser] = useDeleteUserMutation()  
    const dispatch = useAppDispatch()

    useEffect(() => {
        if(users && users.length) {
            const obj: {[key: string]: {cb: (...args: Array<any>) => Promise<void>}} = {}

            Object.keys(users[0]).map(el => {
                obj[el] = {
                    cb: async (id: number, {field, value}) => {
                        try {
                            const res = await updateUser({userId: id, data: {[field]: value}}).unwrap()

                            dispatch(hint({type: "success", text: res.data || ""}))
                            refetch()
                        } catch(e) {
                            const err = e as AdministrationUpdateReport
                 
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
            name: "Delete",
            cb: async ({id}: Exclude<typeof users, string | undefined>[number]) => {
                try {
                    const res = await deleteUser(id).unwrap()

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
        },
    ]

    return (
        <div className="max-w-[1110px] mx-auto">
            <h1 className="text-high-emphasis text-3xl mt-20">Sooo eh... Yea</h1>
            <h2 className="text-medium-emphasis">Here you can edit bans, you can unban ppl and chnage some thing just double click</h2>

            {binds && users && <AdministrationTable binds={binds} data={users as Exclude<typeof users, string>} actions={actions} className="mt-10" />}
            {!binds &&
                <h3 className="text-medium-emphasis text-2xl mt-10 text-center">Seems like there's no anything to edit :thonk:</h3>
            }
        </div>
    )
}