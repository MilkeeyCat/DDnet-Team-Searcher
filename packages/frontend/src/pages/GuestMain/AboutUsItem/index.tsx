import "./styles.scss"

interface OwnProps {
    imageUrl: string,
    text: string
}

export const AboutUsItem:React.FC<OwnProps> = ({imageUrl, text}) => {
    return (
        <div className={"about-us__list-item"}>
            <img src={imageUrl} alt="tee image"/>
            <p>{text}</p>
        </div>
    )
}