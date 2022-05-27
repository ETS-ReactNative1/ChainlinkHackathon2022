import React from "react";

import jonathan from './jonathan.jpg'; // Tell webpack this JS file uses this image
import tlu from './TLu.jpg'; // Tell webpack this JS file uses this image
import brenda from './brenda.png'; // Tell webpack this JS file uses this image
import chess from './chess.jpg'; // Tell webpack this JS file uses this image
import Image from 'next/image';

const About = () => {
    return (
 

<div className="2xl:container 2xl:mx-auto lg:py-16 lg:px-20 md:py-12 md:px-6 py-9 px-4 w-full bg-white">
            <div className="flex flex-col lg:flex-row justify-between gap-8">
                <div className="w-full lg:w-5/12 flex flex-col justify-center">
                    <h1 className="text-3xl lg:text-4xl font-bold leading-9 text-gray-800 pb-4">About Us</h1>
                    <p className="font-normal text-base leading-6 text-gray-600 ">We are 2 friends who met through competitive chess. We met each other through participating in chess clubs and tournaments. Through playing and analyzing chess games together, we have developed a lifetime friendship as well as a competive but positive relationship!</p>
                </div>
                <div className="w-full lg:w-8/12 ">
                    <Image className="w-full h-full" src={chess} alt="A group of People" />
                </div>
            </div>

            <div className="flex lg:flex-row flex-col justify-between gap-8 pt-12">
                <div className="w-full lg:w-5/12 flex flex-col justify-center">
                    <h1 className="text-3xl lg:text-4xl font-bold leading-9 text-gray-800 pb-4">Our Story</h1>
                    <p className="font-normal text-base leading-6 text-gray-600 ">Jonathen and Zechen are huge sports and NFT enthusiasts. They have recently gotten really
                    into NBA topshot and NFL All day and wanted to create a project similar to them
                    that combines sports and NFTs. After thinking over the idea for a bit, both Jonathan and Zechen 
                    realized that they love making bets on games and decided to create ParlayMint, a marketplace for placing
                    parlay bets through NFTs!
                     </p>
                </div>
                <div className="w-full lg:w-8/12 lg:pt-8">
                    <div className="grid  sm:grid-cols-2 grid-cols-1 clg:gap-4 shadow-lg rounded-md">
                        <div className="p-4 pb-6 flex justify-center flex-col items-center">
                            <Image className="md:block hidden" src={jonathan} alt="Alexa featured Image" />

                            <p className="font-medium text-xl leading-5 text-gray-800 mt-4">Jonathan</p>
                        </div>
                        <div className="p-4 pb-6 flex justify-center flex-col items-center">
                            <Image className="md:block hidden" src={tlu} alt="Olivia featured Image" />
                            <p className="font-medium text-xl leading-5 text-gray-800 mt-4">Zechen</p>
                        </div>
        

                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
