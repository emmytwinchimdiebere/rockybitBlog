import {Poppins,} from  "next/font/google"
import "./globals.css";


interface Props{
    children: React.ReactNode;
}

const  Poppin  =  Poppins({weight:"100", subsets:["latin"]})

export default function Layout({children}: Props){

    return (
        <html lang="en">
            <body>
            <div  className={`${Poppin}`}>
            {children}
       
        </div>
        </body>
        </html>
    )

}