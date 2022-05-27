import React, { useEffect, useState } from "react";
import { useHistory,NavLink } from "react-router-dom";
import logo from './logo.png'; // with import
import Image from 'next/image';
function FAQ() {
    const [show, setShow] = useState(false);
    return (
        <>
            <div className="bg-white">
                <div className="container mx-auto">
                    <div role="article" className="bg-white md:px-8">
                        <div className="px-4 xl:px-0 py-10">
                            <div className="flex flex-col lg:flex-row flex-wrap">
                                <div className="mt-4 lg:mt-0 lg:w-3/5">
                                    <div>
                                        <h1 className="text-3xl ml-2 lg:ml-0 lg:text-4xl font-bold text-gray-900 tracking-normal lg:w-11/12">Frequently asked questions</h1>
                                    </div>
                                </div>
                                <div className="lg:w-2/5 flex mt-10 ml-2 lg:ml-0 lg:mt-0 lg:justify-end">
                                    <div className="pt-2 relative  text-gray-600">
                                    
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 xl:px-0">
                            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 pb-6 gap-8">
                                <div role="cell" className="border-solid border-4 border-green-400">
                                    <div className="bg-white p-5 rounded-md relative h-full w-full">
                                        {/* className="absolute inset-0 object-center object-cover h-full w-full"  */}
                                        <span>
                                            <img className="bg-gray-200 p-2 mb-5 rounded-full" src="https://i.ibb.co/27R6nk5/home-1.png" alt="home-1" />
                                        </span>
                                        <h1 className="pb-4 text-2xl font-semibold">General</h1>
                        
                                        <div className="my-5">
                                         <div className="">
                                            <div className="flex items-center pb-4  cursor-pointer w-full space-x-3">
                                                
                                                <details className="mb-4">
                                                <summary className="font-semibold rounded-md px-4">
                                                What is ParlayMint?
                                                </summary>

                                                <span>
                                                ParlayMint is a peer-to-peer NFT Marketplace that allows anybody to mint and trade Parlay-based NFTs
                                                </span>
                                            </details>
                                            </div>
                                            </div>
                                            <div className="">
                                            <div className="flex items-center pb-4  cursor-pointer w-full space-x-3">
                                                
                                                <details className="mb-4">
                                                <summary className="font-semibold rounded-md px-4">
                                                How will it work?
                                                </summary>

                                                <span>
                                                Each NFT will have off-chain metadata containing info on the parlay of interest. Authorized indiviaduals can create
                                                NFTs with info on their bet and they can sell it to other people who want to make the same expert bet as them
                                                </span>
                                            </details>
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div role="cell" className="border-solid border-4 border-green-400">
                                <div className="bg-white p-5 rounded-md relative h-full w-full">
                                        {/* className="absolute inset-0 object-center object-cover h-full w-full"  */}
                                        <span>
                                            <img className="bg-gray-200 p-2 mb-5 rounded-full" src="https://i.ibb.co/bdGyLYk/pricetags-1.png" alt="pricetags-1" />
                                        </span>
                                        <h1 className="pb-4 text-2xl font-semibold">Sports</h1>
                        
                                        <div className="my-5">
                                         <div className="">
                                            <div className="flex items-center pb-4  cursor-pointer w-full space-x-3">
                                                
                                                <details className="mb-4">
                                                <summary className="font-semibold rounded-md px-4">
                                                What Sports are currently available?
                                                </summary>

                                                <span>
                                               NBA,NFL,MLB,NHL
                                                </span>
                                            </details>
                                            </div>
                                            </div>
                                            <div className="">
                                            <div className="flex items-center pb-4  cursor-pointer w-full space-x-3">
                                                
                                                <details className="mb-4">
                                                <summary className="font-semibold rounded-md px-4">
                                               Where do the odds for the bets come from?
                                                </summary>

                                                <span>
                                                We use the odds api from the-odds-api.com to get our odds for our bets.
                                                </span>
                                            </details>
                                            </div>
                                            </div>
                                        </div>
                                    </div>
             
                                </div>
                                <div role="cell" className="border-solid border-4 border-green-400">
                                <div className="bg-white p-5 rounded-md relative h-full w-full">
                                        {/* className="absolute inset-0 object-center object-cover h-full w-full"  */}
                                        <span>
                                            <img className="bg-gray-200 p-2 mb-5 rounded-full" src="https://i.ibb.co/GT4KHvJ/card-1.png" alt="home-1" />
                                        </span>
                                        <h1 className="pb-4 text-2xl font-semibold">NFTs</h1>
                        
                                        <div className="my-5">
                                         <div className="">
                                            <div className="flex items-center pb-4  cursor-pointer w-full space-x-3">
                                                
                                                <details className="mb-4">
                                                <summary className="font-semibold rounded-md px-4">
                                                How many NFTs are available to purchase?
                                                </summary>

                                                <span>
                                                Depends on how many authorized indiviaduals we have and how many NFTs they decide to mint at a time.
                                                </span>
                                            </details>
                                            </div>
                                            </div>
                                            <div className="">
                                            <div className="flex items-center pb-4  cursor-pointer w-full space-x-3">
                                                
                                                <details className="mb-4">
                                                <summary className="font-semibold rounded-md px-4">
                                                What blockchain are these NFTs minted on?
                                                </summary>

                                                <span>
                                                Etheruem, Polygon
                                              </span>
                                            </details>
                                            </div>
                                            </div>
                                            <div className="">
                                            <div className="flex items-center pb-4  cursor-pointer w-full space-x-3">
                                                
                                                <details className="mb-4">
                                                <summary className="font-semibold rounded-md px-4">
                                                    Where do I buy NFTs?
                                                </summary>

                                                <span>
                                                In the marketplace!
                                              </span>
                                            </details>
                                            </div>
                                            </div>
                                        </div>
                                    </div>
             
                                </div>
             
                             
                       </div>
                    </div>
                     </div>
                </div>
            </div>
        </>
    );
}

export default FAQ;
