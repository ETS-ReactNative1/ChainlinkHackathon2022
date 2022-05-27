import React, { useEffect, useState } from "react";
import Image from 'next/image';
import ape from '../images/ape.jpg'; // Tell webpack this JS file uses this image
//import coupon from '../images/rancid_coupon.jpg'; // Tell webpack this JS file uses this image
import Router from "next/router";
import Link from 'next/link'
import Bet from '../images/Bet.png'; // Tell webpack this JS file uses this image


function Home() {
  function onChangeexplore() {
    Router.push({
        pathname: '/nftmarketplace',
        query: { id: "explore"},
    })
}
  return (
    <>
      <body className="gradient leading-relaxed tracking-wide flex flex-col ">
        <div className="container ml-auto ">
          <div className="container mx-auto h-screen">
            <div className="text-center px-3 lg:px-0">
              <h1
                className="p-8 text-6xl md:text-3xl lg:text-6xl font-black leading-tight"
              >
                An NFT Marketplace for Parlay-Based NFTs
              </h1>
              <p
                className="leading-normal text-gray-800 text-base md:text-xl lg:text-2xl"
              >
                Mint and Trade NFTs with Parlay-Based Utility
              </p>

              <div className="grid grid-cols-4 gap-16 pt-2 ">
                <div></div>
                  <button
                    className="bg-green-300 rounded-full lg:mx-0 hover:bg-green-500  text-gray-800 font-extrabold rounded  md:my-6 py-4 px-4 shadow-lg w-48" onClick={() => onChangeexplore()}
                  >
                    Explore
                  </button>
                <Link href="/RestaurantVerification">
                <a>
                  <button
                    className="bg-green-300 rounded-full lg:mx-0 hover:bg-green-500 text-gray-800 font-extrabold rounded  md:my-6 py-4 px-8 shadow-lg w-48 px-16"
                  >
                    Create
                  </button>
                </a>
                </Link>
                </div>

              <div className="grid grid-cols-4 gap-16">
                <div></div>

                <div className="text-left px-1 md:px-0 w-64 h-64 col-span-1">
                  <Image className="object-fill w-64 h-64" src={ape} alt="Logo" />
                </div>

                <div className="text-left px-1 md:px-0 w-64 h-64 col-span-1">
                  <Image className="object-fill w-64 h-64" src={Bet} alt="Logo" />
                </div>

                <div></div>
              </div>


            </div>

            <div className="flex items-center w-full mx-auto content-end">
              <div
                className="browser-mockup flex flex-1 m-6 md:px-0 md:m-12 bg-white w-1/2 rounded shadow-xl"
              ></div>
            </div>
          </div>





        </div>
        <section className="bg-white border-b py-12 ">
          <div
            className="container mx-auto flex flex-wrap items-center justify-between pb-12"
          >
            <h2
              className="w-full my-2 text-xl font-black leading-tight text-center text-gray-800 lg:mt-8"
            >
              Join our social media (coming soon!)
            </h2>
            <div className="w-full mb-4">
              <div
                className="h-1 mx-auto gradient w-64 opacity-25 my-0 py-0 rounded-t"
              ></div>
            </div>

            <div
              className="flex flex-1 flex-wrap max-w-4xl mx-auto items-center justify-between text-xl text-gray-500 font-bold opacity-75"
            >
              <span className="w-1/2 p-4 md:w-auto flex items-center"
              ><svg
                className="h-10 w-10 mr-4 fill-current text-gray-500 opacity-75"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                  <path
                    d="M7 0H6L0 3v6l4-1v12h12V8l4 1V3l-6-3h-1a3 3 0 0 1-6 0z"
                  /></svg>
                facebook</span>

              <span className="w-1/2 p-4 md:w-auto flex items-center"
              ><svg
                className="h-10 w-10 mr-4 fill-current text-gray-500 opacity-75"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                  <path
                    d="M15.75 8l-3.74-3.75a3.99 3.99 0 0 1 6.82-3.08A4 4 0 0 1 15.75 8zM1.85 15.3l9.2-9.19 2.83 2.83-9.2 9.2-2.82-2.84zm-1.4 2.83l2.11-2.12 1.42 1.42-2.12 2.12-1.42-1.42zM10 15l2-2v7h-2v-5z"
                  /></svg>
                discord</span>

              <span className="w-1/2 p-4 md:w-auto flex items-center"
              ><svg
                className="h-10 w-10 mr-4 fill-current text-gray-500 opacity-75"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                  <path
                    d="M10 12a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-3a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm4 2.75V20l-4-4-4 4v-8.25a6.97 6.97 0 0 0 8 0z"
                  /></svg>
                twitter</span>

              <span className="w-1/2 p-4 md:w-auto flex items-center"
              ><svg
                className="h-10 w-10 mr-4 fill-current text-gray-500 opacity-75"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                  <path
                    d="M15.3 14.89l2.77 2.77a1 1 0 0 1 0 1.41 1 1 0 0 1-1.41 0l-2.59-2.58A5.99 5.99 0 0 1 11 18V9.04a1 1 0 0 0-2 0V18a5.98 5.98 0 0 1-3.07-1.51l-2.59 2.58a1 1 0 0 1-1.41 0 1 1 0 0 1 0-1.41l2.77-2.77A5.95 5.95 0 0 1 4.07 13H1a1 1 0 1 1 0-2h3V8.41L.93 5.34a1 1 0 0 1 0-1.41 1 1 0 0 1 1.41 0l2.1 2.1h11.12l2.1-2.1a1 1 0 0 1 1.41 0 1 1 0 0 1 0 1.41L16 8.41V11h3a1 1 0 1 1 0 2h-3.07c-.1.67-.32 1.31-.63 1.89zM15 5H5a5 5 0 1 1 10 0z"
                  /></svg>
                youtube</span>
            </div>
          </div>
        </section>



      </body>
    </>

  );
}

export default Home;
