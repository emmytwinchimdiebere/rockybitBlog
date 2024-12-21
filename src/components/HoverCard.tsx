import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card"


interface Props{
    children:React.ReactNode,
    src?:string,
    functionCall?:()=>{},
    className?:string,
    name:string,
    followers:number, 
    bio:string
}

const HoverCardComponent =  ({children,  src,  functionCall,  className, name, followers, bio}:Props)=>{

    return(
        <HoverCard>
            <HoverCardTrigger asChild>
                {children}
            </HoverCardTrigger>

            <HoverCardContent>
                <div  className=" flex flex-col relative w-full px-4">
                    <div className="flex flex-row justify-between">
                            <Avatar className=" w-8 h-8">
                                <AvatarImage  src={src} />
                                <AvatarFallback>Profile</AvatarFallback>
                            </Avatar>

                            <Button className={className ?? "rounded-lg hover:bg-transparent hover:text-black hover:border-black transition hover:border-2 text-white bg-black px-[5px]"} onClick={functionCall} variant={"secondary"}>follow</Button>
                    </div>

                    <div className="mt-2 text-[14px]  flex flex-col w-full pb-2">
                        <span className="text-black font-bold ">{name}</span>
                        <span className="font-light flex gap-2  ">{followers} followers.</span>
                        <span className=" mt-3 text-justify text-[12px] font-light">{bio}</span>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    )



}

export default HoverCardComponent