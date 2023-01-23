import {Route, Routes} from "react-router-dom"
import {privateRoute, publicRoute} from "./router"
import {useAppSelector} from "../utils/hooks/hooks"

export const AppRouter = () => {
    let isAuthed = useAppSelector(state => state.app.isAuthed)

    return (
        <main>
            {isAuthed ?
                <Routes>
                    {privateRoute.map(({Component, ...route}) => <Route key={route.path} path={route.path} element={<Component/>}/>)}
                </Routes>
                :
                <Routes>
                    {publicRoute.map(({Component, ...route}) => <Route key={route.path} path={route.path} element={<Component/>}/>)}
                </Routes>
            }
        </main>
    )
}