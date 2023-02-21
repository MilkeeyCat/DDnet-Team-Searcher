import { Route, Routes } from 'react-router-dom'
import { IRoute, privateRoute, publicRoute } from './router'
import { useAppSelector } from '../utils/hooks/hooks'

const renderRoutes = (routes: Array<IRoute>) => {
    return routes.map(({ path, Component, children }: IRoute) => (
        <Route key={path} path={path} element={<Component />}>
            {children && renderRoutes(children)}
        </Route>
    ))
}

export const AppRouter = () => {
    let isAuthed = useAppSelector((state) => state.app.isAuthed)

    return (
        <main>
            {isAuthed ?
                <Routes>{renderRoutes(privateRoute)}</Routes> :
                <Routes>{renderRoutes(publicRoute)}</Routes>
            }
        </main>
    )
}
