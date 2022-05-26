import { useRouter } from 'next/router'
import React, { useMemo, useState, useEffect } from "react";
import Profile2 from "components/Profile"
import { useMoralis } from "react-moralis";


export default function GameDetails() {
    const { Moralis, enableWeb3 } = useMoralis();
    const router = useRouter()
    const profile_id = router.query.id
    const tab_num = router.query.tab

    async function fetch_profile_image() {
        //await Moralis.Cloud.run("sendEmailToSeller", params); 
        var params = {addr: profile_id}
        try {
            const res = await Moralis.Cloud.run("fetch_profile_image", params);
            console.log("USERS!!!:", res)
            return res

        }
        catch (e) {
            console.log("error!", e)
            //alert("david")
        }
    }

    return (
        <div>

            {/* <h1>HELLO????</h1> */}

            {/* <h1>Game Details Page with id: {game_id}</h1>
                <h1>Game Details Page with Requester: {Games.attributes.requester_wallet_address}</h1>
                <h1>Game Details Page with FEN: {Games.attributes.fen}</h1>
                <h1>Game Details Page with PGN: {Games.attributes.pgn}</h1>
                <h1>Game Details Page with Question: {Games.attributes.questions}</h1>
                <h1>Game Details Page with Max Price Willing: {Games.attributes.price}</h1> */}
            {/* <div class='pt-7'>
                <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full" onClick={fetch_profile_image} >  Cloud</button>
            </div>
            <h1>PROFILE Details Page with ID: {profile_id}</h1>
            <h1>PROFILE Details Page with tab: {tab_num}</h1> */}
            <Profile2 wallet_addr={profile_id} tab_num={tab_num} />
            {/* <Profile2 wallet_addr={profile_id} />; */}


            <div>

            </div>

        </div>
    )


}

//export default gameDetails;