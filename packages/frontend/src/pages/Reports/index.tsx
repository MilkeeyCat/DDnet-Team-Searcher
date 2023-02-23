import { AdministrationUpdateBanInfo, AdministrationUpdateReport } from "@app/shared/types/api/administration.type"
import { useEffect, useState } from "react"
import { useDeleteReportMutation, useGetReportsQuery, useUpdateReportMutation } from "../../api/administration-api"
import { useBanUserMutation } from "../../api/users-api"
import { AdministrationTable } from "../../components/AdministrationTable"
import { hint } from "../../store/slices/hints"
import { useAppDispatch } from "../../utils/hooks/hooks"

export const Reports = () => {
    const {data: reports, isSuccess, refetch} = useGetReportsQuery()
    const [binds, setBinds] = useState<any>()
    const [updateReport] = useUpdateReportMutation()    
    const [deleteReport] = useDeleteReportMutation()  
    const [banUser] = useBanUserMutation()  
    const dispatch = useAppDispatch()

    useEffect(() => {
        if(reports && reports.length) {
            const obj: {[key: string]: {cb: (...args: Array<any>) => Promise<void>}} = {}

            Object.keys(reports[0]).map(el => {
                obj[el] = {
                    cb: async (id: number, {field, value}: any) => {
                        try {
                            const res = await updateReport({reportId: id, data: {[field]: value}}).unwrap()

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
            cb: async ({id}: Exclude<typeof reports, string | undefined>[number]) => {
                try {
                    const res = await deleteReport(id).unwrap()

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
        {
            name: "Ban",
            cb: async ({reported_user_id}: Exclude<typeof reports, string | undefined>[number]) => {
                try {
                    // i can use that ban modal here instead of this
                    const res = await banUser({userId: reported_user_id, reason: null}).unwrap()

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

            {binds && reports && <AdministrationTable binds={binds} data={reports as Exclude<typeof reports, string>}  actions={actions} className="mt-10" />}
            {!binds &&
                <h3 className="text-medium-emphasis text-2xl mt-10 text-center">Seems like there's no anything to edit :thonk:</h3>
            }
        </div>
    )
}