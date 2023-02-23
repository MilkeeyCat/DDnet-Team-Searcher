import { AdministrationUpdateBanInfo, AdministrationUpdateReport } from "@app/shared/types/api/administration.type"
import { useEffect, useState } from "react"
import { useDeleteRoleMutation, useDeleteUserMutation, useGetRolesQuery, useGetUsersQuery, useUpdateRoleMutation, useUpdateUserMutation } from "../../api/administration-api"
import { AdministrationTable } from "../../components/AdministrationTable"
import { hint } from "../../store/slices/hints"
import { useAppDispatch } from "../../utils/hooks/hooks"

export const Roles = () => {
    const {data: roles, isSuccess, refetch} = useGetRolesQuery()
    const [binds, setBinds] = useState<any>()
    const [updateRole] = useUpdateRoleMutation()    
    const [deleteRole] = useDeleteRoleMutation()  
    const dispatch = useAppDispatch()

    useEffect(() => {
        if(roles && roles.length) {
            const obj: {[key: string]: {cb: (...args: Array<any>) => Promise<void>}} = {}

            Object.keys(roles[0]).map(el => {
                obj[el] = {
                    cb: async (id: number, {field, value}) => {
                        try {
                            const res = await updateRole({roleId: id, data: {[field]: value}}).unwrap()

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
            cb: async ({id}: Exclude<typeof roles, string | undefined>[number]) => {
                try {
                    const res = await deleteRole(id).unwrap()

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

            {binds && roles && <AdministrationTable binds={binds} data={roles as Exclude<typeof roles, string>} actions={actions} className="mt-10" />}
            {!binds &&
                <h3 className="text-medium-emphasis text-2xl mt-10 text-center">Seems like there's no anything to edit :thonk:</h3>
            }
        </div>
    )
}