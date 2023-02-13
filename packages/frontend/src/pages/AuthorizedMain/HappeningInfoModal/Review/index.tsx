import { Review as ReviewT } from "@app/shared/types/Review.type"
import { Link } from "react-router-dom"
import { Avatar } from "../../../../components/Avatar"
import defaultTee from "../../../../assets/images/default-tee.png"

type OwnProps = {
    review: ReviewT
}

export const Review = ({review: {author, rate, reviewedUser, text}}: OwnProps) => {
    return (
        <div className=" rounded-[10px] bg-primary-3 pt-2.5 [&:not(:first-child)]:mt-2.5">
           <div className="flex items-center px-2.5">
                <div className="px-2.5">
                    <p><Link className="font-semibold" to={`/profile/${author.id}`}>{author.username}</Link> about <Link className="font-semibold" to={`/profile/${reviewedUser.id}`}>{reviewedUser.username}</Link>:</p>
                    <div className="flex items-center">
                        <div className="flex -ml-1">
                            {rate && new Array(rate).fill(rate).map(item => (
                                <img className="min-w-7 w-full h-7 [&:not(:first-child)]:-ml-3" src={defaultTee} />
                            ))}
                        </div>
                        <span className="ml-2 text-[12px]">4 centuries ago</span>
                    </div>
                </div>
           </div>
           <hr className="text-[#89745A]"/>
           <p className="px-2.5 mt-4 pb-2">{text}</p>
        </div>
    )
}