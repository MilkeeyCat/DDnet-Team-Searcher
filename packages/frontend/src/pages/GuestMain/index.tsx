import {AboutUsItem} from "./AboutUsItem"
import defaultTee from "../../assets/images/default-tee.png"
import arrowDown from "../../assets/images/arrow-down.png"
import {Button} from "../../components/ui/Button"
import leftSliderButton from "../../assets/images/left-slider-button.png"
import rightSliderButton from "../../assets/images/right-slider-button.png"
import moreIcon from "../../assets/images/more.png"
import "react-responsive-carousel/lib/styles/carousel.min.css"
import {Carousel} from "react-responsive-carousel"
import {CSSProperties} from "react"
import test from "../../assets/images/test.png"

const arrowStyles: CSSProperties = {
    position: "absolute",
    zIndex: 999,
    top: "calc(50% - 15px)",
    width: 30,
    height: 30,
    cursor: "pointer",
}

export const GuestMain = () => {
    const aboutUsFax = [
        "0 runs already done",
        ">0 people are finding mates for the run",
        ">0 active users",
        "I finally found a mate to finish Sunny Side Up",
        "0+ events are waiting for you"
    ]

    const reviews = [
        {
            username: "Yo mum",
            review: "Cul!"
        },
        {
            username: "Stepfunn",
            review: "Milkeey, nobody's gonna use it anyways."
        }
    ]

    const posts = [
        {
            title: "Lol kek",
            pubDate: "04.04.2022",
            author: "MilkeeyCat",
            textPreview: `Icefish skipjack tuna sand tilefish tuna red snapper mustache triggerfish Dolly Varden trout Jack Dempsey pike conger. Sábalo jack trout prickleback round whitefish, "redside parrotfish," freshwater eel, desert pupfish porcupinefish silverside emperor....`
        },
        {
            title: "Lol kek",
            pubDate: "04.04.2022",
            author: "MilkeeyCat",
            textPreview: `Icefish skipjack tuna sand tilefish tuna red snapper mustache triggerfish Dolly Varden trout Jack Dempsey pike conger. Sábalo jack trout prickleback round whitefish, "redside parrotfish," freshwater eel, desert pupfish porcupinefish silverside emperor....`
        },
        {
            title: "Lol kek",
            pubDate: "04.04.2022",
            author: "MilkeeyCat",
            textPreview: `Icefish skipjack tuna sand tilefish tuna red snapper mustache triggerfish Dolly Varden trout Jack Dempsey pike conger. Sábalo jack trout prickleback round whitefish, "redside parrotfish," freshwater eel, desert pupfish porcupinefish silverside emperor....`
        }
    ]

    return (
        <>
            <div className="bg-[url('/src/assets/images/ddnet-gameplay.png')]">
                <div className="h-[1166px] pt-[170px] flex max-w-fit mx-auto px-10 xl:m-0 flex-col xl:pl-[400px] text-[white]">
                    <h1 className="m-0 text-3xl md:text-6xl font-bold">DDrace Team<br/> Searcher<span className="text-primary-1">.</span></h1>
                    <h2 className="m-0 mt-2.5 text:xl md:text-3xl font-medium">Find your dream team</h2>
                    <p className="m-0 mt-6 max-w-[540px]">I hope one day I will finish this website and you will be able to find people to play with (or
                        not ¯\_(ツ)_/¯ (I suck in design btw(I hope it doesnt look too much cringe)))</p>
                    <div className="flex mt-9 [&>:not(:first-child)]:ml-5">
                        <div>
                            <s className="font-medium text-3xl">1200</s>
                            <p className="mt-2.5">PLAYERS REGISTERED</p>
                        </div>
                        <div>
                            <s className="font-medium text-3xl">500</s>
                            <p className="mt-2.5">TEAMS NEED YOU</p>
                        </div>
                    </div>
                    <Button styleType={"bordered"} className="mt-10 max-w-fit text-sm sm:text-base !bg-[rgba(38,34,29,.8)]"><img src={arrowDown} className="mr-2" alt="arrow down"/>What's
                        DDrace Team Searcher?</Button>
                </div>
            </div>
            <div className="max-w-[840px] mx-auto px-10 -mt-[200px]">
                <p className="text-3xl font-medium text-[white]">Some useless info about DDrace Team Searcher.:</p>
                <div className="flex flex-wrap justify-around">
                    {aboutUsFax.map(text => (
                        <AboutUsItem imageUrl={defaultTee} text={text}/>
                    ))}
                </div>
            </div>
            <div className="mt-[150px] text-[white]">
                <p className="text-3xl font-medium text-center">What homies are saying 'bout us:</p>
                <Carousel className="max-w-[800px] mt-16 mx-auto" infiniteLoop showStatus={false} showThumbs={false} showIndicators={false}
                        autoPlay
                        renderArrowNext={(clickHandler, hasNext, label) => hasNext &&
                            <p style={{...arrowStyles, right: "15px"}} title={label} onClick={clickHandler}><img
                                src={rightSliderButton}/></p>}
                        renderArrowPrev={(clickHandler, hasPrev, label) => hasPrev &&
                            <p style={{...arrowStyles, left: "15px"}} title={label} onClick={clickHandler}><img
                                src={leftSliderButton}/></p>}>
                    {reviews.map(el => (
                        <div>
                            <p className="max-w-[80%] mx-auto">"{el.review}"©</p>
                            <div className="mx-auto mt-7 flex items-center justify-center flex-col">
                                <img src={defaultTee} className="max-w-[100px]" alt="default tee"/>
                                <p>{el.username}</p>
                            </div>
                        </div>
                    ))}
                </Carousel>
            </div>
            <div className="my-[150px]">
                <p className="font-medium text-3xl text-[white] text-center">Last news</p>
                <div className="flex justify-center flex-wrap">
                    {posts.map((post, id) => (
                        <div key={id} className="max-w-[340px] basis-[260px] grow-[1] mx-5 bg-primary-2 rounded-[20px] my-5">
                            <img className="rounded-t-[20px] max-h-[150px] h-full max-w-full w-full" src={test}/>
                            <div className="pt-2.5 pb-8 px-5">
                                <span className="text-[white] m-0">{post.pubDate}</span>
                                <p className="text-[white] m-0 font-medium mt-5">{post.title}</p>
                                <p className={"text-[white] m-0 mt-4"}>{post.textPreview}</p>
                                <div className="mt-7 flex justify-between">
                                    <span className="text-[white] font-medium m-0">{post.author}</span>
                                    <button className="text-primary-1 flex items-center">More <img src={moreIcon} className="ml-2.5" alt="arrow left icon"/></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}