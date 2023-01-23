import "./App.scss"
import {Header} from "./components/Header"
import {AppRouter} from "./router/AppRouter"
import {Footer} from "./components/Footer"
import {ModalInfo} from "./components/ModalInfo"
import { useAppSelector } from "./utils/hooks/hooks"
import { useEffect } from "react"
import { useLazyGetUserDataQuery } from "./api/users-api"

export const App = () => {
    const isAuthed = useAppSelector(state => state.app.isAuthed)
    const [getUserData] = useLazyGetUserDataQuery()

    useEffect(() => {
        getUserData()
    }, [isAuthed])

    return (
        <>
            <Header/>
            <AppRouter/>
            <ModalInfo/>
            <Footer/>
        </>
    )
}

export default App
