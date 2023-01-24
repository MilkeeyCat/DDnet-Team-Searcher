import { useEffect } from "react"

export const useOutsideClickHandler = <T extends HTMLElement>(ref: React.RefObject<T>, condition: boolean, callback: () => void) => {
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if(condition && !(e?.target as Element).closest(ref.current?.className.split(" ").map(a => `.${a}`).join(" ") || "")) {
                callback()
            }
        }

        const handler2 = (_: any) => {
            document.addEventListener("click", handler)
            document.removeEventListener("mouseup", handler2)
        }

        document.addEventListener("mouseup", handler2)

        return () => {
            document.removeEventListener("click", handler)
        }
    }, [condition])
}