import "./styles.scss"

interface OwnProps {
    src: string | null;
    username: string;
    size?: number
}

function rainbow(numOfSteps: number, step: number) {
    //I just stole this code from stackoverflow, let it be here
    let r, g, b;
    let h = step / numOfSteps;
    let i = ~~(h * 6);
    let f = h * 6 - i;
    let q = 1 - f;
    switch(i % 6){
        case 0: r = 1; g = f; b = 0; break;
        case 1: r = q; g = 1; b = 0; break;
        case 2: r = 0; g = 1; b = f; break;
        case 3: r = 0; g = q; b = 1; break;
        case 4: r = f; g = 0; b = 1; break;
        case 5: r = 1; g = 0; b = q; break;
    }
    let c = "#" + ("00" + (~ ~(r as any * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g as any * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b as any * 255)).toString(16)).slice(-2);
    return (c);
}

export const Avatar: React.FC<OwnProps> = ({src, username, size = 20}) => {
    return (
        <div className={"avatar"} style={{"width": `${size}px`, "height": `${size}px`}}>
            {src === null ?
                <p style={{"background": rainbow(username.charCodeAt(0), username.length)}} className={"avatar__letter"}>{username[0]}</p>
                :
                <img src={src}/>
            }
        </div>
    )
}