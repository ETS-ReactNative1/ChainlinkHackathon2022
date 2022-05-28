import React from "react";
import { useHistory, NavLink } from "react-router-dom";
import logo from './logo.png'; // with import

import jonathan from './jonathan.jpg'; // Tell webpack this JS file uses this image
import tlu from './TLu.jpg'; // Tell webpack this JS file uses this image
import brenda from './brenda.png'; // Tell webpack this JS file uses this image
import chess from './chess.jpg'; // Tell webpack this JS file uses this image

const Demo = () => {
    return (
        <div className="w-full bg-white">


            {/* <div class="flex h-screen w-screen">
                <div class="m-auto">
                    <iframe className="w-full h-4/5" src='https://www.youtube.com/embed/E7wJTI-1dvQ'
                        frameborder='0'
                        allow='autoplay; encrypted-media'
                        allowfullscreen
                        title='video'
                    />
                    <button>button</button>
                </div>
            </div> */}

            <div>
                <div className="w-screen h-screen flex flex-col mt-12 items-center">

                    <iframe className="w-1/2 h-1/2" src='https://www.youtube.com/embed/CLmXSwC4zfc'
                        frameBorder='0'
                        allow='autoplay; encrypted-media'
                        allowFullScreen
                        title='video'
                    />



                </div>
            </div>


            {/* <div>
                <div className="w-4/5 h-screen flex ">

                    <iframe className="text-center m-auto w-full h-4/5" src='https://www.youtube.com/embed/E7wJTI-1dvQ'
                        frameborder='0'
                        allow='autoplay; encrypted-media'
                        allowfullscreen
                        title='video'
                    />
                </div>
            </div> */}

            {/* <div className="2xl:container 2xl:mx-auto lg:py-16 lg:px-20 md:py-12 md:px-6 py-9 px-4 w-full bg-white">


            </div> */}
        </div>
    );
};

export default Demo;
