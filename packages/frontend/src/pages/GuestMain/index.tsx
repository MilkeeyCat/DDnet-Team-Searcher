import ddnetGameplay from "../../assets/images/ddnet-gameplay.png"
import {AboutUsItem} from "./AboutUsItem"
import defaultTee from "../../assets/images/default-tee.png"
import arrowDown from "../../assets/images/arrow-down.png"
import "./styles.scss"
import {Button} from "../../components/ui/Button"

import leftSliderButton from "../../assets/images/left-slider-button.png"
import rightSliderButton from "../../assets/images/right-slider-button.png"
import moreIcon from "../../assets/images/more.png"


import test from "../../assets/images/test.png"

import "react-responsive-carousel/lib/styles/carousel.min.css"
import {Carousel} from "react-responsive-carousel"
import {CSSProperties} from "react"

const arrowStyles: CSSProperties = {
    position: "absolute",
    zIndex: 999,
    top: "calc(50% - 15px)",
    width: 30,
    height: 30,
    cursor: "pointer",
}

export const GuestMain = () => {
    return (
        <>
            <div className={"first-screen"}>
                <img src={ddnetGameplay} alt="ddnet-gameplay"/>
                <div className={"first-screen__text"}>
                    <h1>DDrace Team<br/> Searcher<span>.</span></h1>
                    <h2>Find your dream team</h2>
                    <p>I hope one day I will finish this website and you will be able to find people to play with (or
                        not ¯\_(ツ)_/¯ (I suck in design btw(I hope it doesnt look too much cringe)))</p>
                    <div className={"first-screen__stats"}>
                        <div className={"first-screen__stats-item"}>
                            <s>1200</s>
                            <p>PLAYERS REGISTERED</p>
                        </div>
                        <div className={"first-screen__stats-item"}>
                            <s>500</s>
                            <p>TEAMS NEED YOU</p>
                        </div>
                    </div>
                    <Button styleType={"bordered"} className={"first-screen__btn"}
                            style={{backgroundColor: "rgba(38, 34, 29, .8)"}}><img src={arrowDown} alt="arrow down"/>What's
                        DDrace Team Searcher?</Button>
                </div>
            </div>
            <div className={"about-us"}>
                <p className={"about-us__header"}>Some useless info about DDrace Team Searcher.:</p>

                <div className={"about-us__list"}>
                    <AboutUsItem imageUrl={defaultTee} text={"0 runs already done"}/>
                    <AboutUsItem imageUrl={defaultTee} text={">0 people are finding mates for the run"}/>
                    <AboutUsItem imageUrl={defaultTee} text={">0 active users"}/>
                    <AboutUsItem imageUrl={defaultTee} text={"I finally found a mate to finish Sunny Side Up"}/>
                    <AboutUsItem imageUrl={defaultTee} text={"0+ events are waiting for you"}/>
                </div>
            </div>
            <div className={"clients-reviews"}>
                <p className="clients-reviews__header">What clients are saying 'bout us:</p>
                <Carousel className={"clients-reviews__carousel"} infiniteLoop showStatus={false} showThumbs={false} showIndicators={false}
                          autoPlay
                          renderArrowNext={(clickHandler, hasNext, label) => hasNext &&
                              <p style={{...arrowStyles, right: "15px"}} title={label} onClick={clickHandler}><img
                                  src={rightSliderButton}/></p>}
                          renderArrowPrev={(clickHandler, hasPrev, label) => hasPrev &&
                              <p style={{...arrowStyles, left: "15px"}} title={label} onClick={clickHandler}><img
                                  src={leftSliderButton}/></p>}>
                    <div className={"clients-reviews__carousel-item"}>
                        <p className={"clients-reviews__carousel-quote"}>"Ive no fucking clue what the actual fuck is
                            it"©</p>
                        <div className={"clients-reviews__carousel-author"}>
                            <img src={defaultTee} alt="tee"/>
                            <span>LCSGAY420</span>
                        </div>
                    </div>
                    <div className={"clients-reviews__carousel-item"}>
                        <p className={"clients-reviews__carousel-quote"}>"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet in inventore natus obcaecati. Accusantium aperiam at consectetur dolorum eos exercitationem expedita iste libero nihil odio, officia officiis quisquam recusandae ullam."©</p>
                        <div className={"clients-reviews__carousel-author"}>
                            <img src={defaultTee} alt="tee"/>
                            <span>LCSGAY420</span>
                        </div>
                    </div>
                    <div className={"clients-reviews__carousel-item"}>
                        <p className={"clients-reviews__carousel-quote"}>"Ive no fucking clue what the actual fuck is
                            it"©</p>
                        <div className={"clients-reviews__carousel-author"}>
                            <img src={defaultTee} alt="tee"/>
                            <p>LCSGAY420</p>
                        </div>
                    </div>
                </Carousel>
            </div>
            <div className={"last-news"}>
                <p className={"last-news__header"}>Last news</p>
                <div className={"last-news__posts"}>
                    <div className={"last-news__post"}>
                        <img className={"last-news__post-thumbnail"} src={test}/>
                        <div className={"last-news__post-inner"}>
                            <span className={"last-news__post-pub-date"}>04.04.2022</span>
                            <p className={"last-news__post-title"}>Blah Blah Blah</p>
                            <p className={"last-news__post-text"}>Icefish skipjack tuna sand tilefish tuna red snapper
                                mustache triggerfish Dolly Varden trout Jack Dempsey pike conger. Sábalo jack trout
                                prickleback round whitefish, "redside parrotfish," freshwater eel, desert pupfish
                                porcupinefish silverside emperor....</p>
                            <div className={"last-news__post-footer"}>
                                <span className={"last-news__post-author"}>MilkeeyCat</span>
                                <button className={"last-news__post-btn"}>More <img src={moreIcon} alt="arrow left icon"/></button>
                            </div>
                        </div>
                    </div>
                    <div className={"last-news__post"}>
                        <img className={"last-news__post-thumbnail"} src={test}/>
                        <div className={"last-news__post-inner"}>
                            <span className={"last-news__post-pub-date"}>04.04.2022</span>
                            <p className={"last-news__post-title"}>Blah Blah Blah</p>
                            <p className={"last-news__post-text"}>Icefish skipjack tuna sand tilefish tuna red snapper
                                mustache triggerfish Dolly Varden trout Jack Dempsey pike conger. Sábalo jack trout
                                prickleback round whitefish, "redside parrotfish," freshwater eel, desert pupfish
                                porcupinefish silverside emperor....</p>
                            <div className={"last-news__post-footer"}>
                                <span className={"last-news__post-author"}>MilkeeyCat</span>
                                <button className={"last-news__post-btn"}>More <img src={moreIcon} alt="arrow left icon"/></button>
                            </div>
                        </div>
                    </div>
                    <div className={"last-news__post"}>
                        <img className={"last-news__post-thumbnail"} src={test}/>
                        <div className={"last-news__post-inner"}>
                            <span className={"last-news__post-pub-date"}>04.04.2022</span>
                            <p className={"last-news__post-title"}>Blah Blah Blah</p>
                            <p className={"last-news__post-text"}>Icefish skipjack tuna sand tilefish tuna red snapper
                                mustache triggerfish Dolly Varden trout Jack Dempsey pike conger. Sábalo jack trout
                                prickleback round whitefish, "redside parrotfish," freshwater eel, desert pupfish
                                porcupinefish silverside emperor....</p>
                            <div className={"last-news__post-footer"}>
                                <span className={"last-news__post-author"}>MilkeeyCat</span>
                                <button className={"last-news__post-btn"}>More <img src={moreIcon} alt="arrow left icon"/></button>
                            </div>
                        </div>
                    </div>
                    <div className={"last-news__post"}>
                        <img className={"last-news__post-thumbnail"} src={test}/>
                        <div className={"last-news__post-inner"}>
                            <span className={"last-news__post-pub-date"}>04.04.2022</span>
                            <p className={"last-news__post-title"}>Blah Blah Blah</p>
                            <p className={"last-news__post-text"}>Icefish skipjack tuna sand tilefish tuna red snapper
                                mustache triggerfish Dolly Varden trout Jack Dempsey pike conger. Sábalo jack trout
                                prickleback round whitefish, "redside parrotfish," freshwater eel, desert pupfish
                                porcupinefish silverside emperor....</p>
                            <div className={"last-news__post-footer"}>
                                <span className={"last-news__post-author"}>MilkeeyCat</span>
                                <button className={"last-news__post-btn"}>More <img src={moreIcon} alt="arrow left icon"/></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}