import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { Card, } from "antd";
import { useWeb3ExecuteFunction } from "react-moralis";
import { Menu } from "antd";
import Created from "components/Created";
import Listed from "components/Listed";
import ListedClient from "components/ListedClient";
import Bought from "components/Bought";
import { useMoralisDapp } from "../providers/MoralisDappProvider/MoralisDappProvider";

import ProfileQuery from "components/ProfileQuery";

import { Tabs } from 'antd';
import { useRouter } from 'next/router'

import {
    BrowserRouter as Router,
    Switch,
    Route,
    NavLink,
    Redirect,
} from "react-router-dom";


const styles2 = {
    content: {
        display: "flex",
        justifyContent: "center",
        fontFamily: "Roboto, sans-serif",
        color: "#041836",
        marginTop: "60px",
        padding: "10px",


    },
    header: {
        position: "fixed",
        zIndex: 1,
        width: "100%",
        background: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontFamily: "Roboto, sans-serif",
        borderBottom: "2px solid rgba(0, 0, 0, 0.06)",
        padding: "0 10px",
        boxShadow: "0 1px 10px rgb(151 164 175 / 10%)",
    },
    headerRight: {
        display: "flex",
        gap: "20px",
        alignItems: "center",
        fontSize: "15px",
        fontWeight: "600",
    },
};

const { Meta } = Card;

const styles = {
    NFTs: {
        display: "flex",
        flexWrap: "wrap",
        WebkitBoxPack: "start",
        justifyContent: "flex-start",
        margin: "0 auto",
        maxWidth: "1000px",
        gap: "10px",
    },
};


function Profile({ wallet_addr = "", tab_num = "collected", curr_user_match = false }) {
    //const {createdNfts} = useCreatedNFTs();
    const [CreatedNFTs, setCreatedNFTs] = useState([]);
    const { Moralis, enableWeb3 } = useMoralis();
    const [loaded, setLoaded] = useState('false')
    const [rand, setRand] = useState('blah')
    const [loading, setLoading] = useState(false);
    const [nftToSend, setNftToSend] = useState(null);
    const [visible, setVisibility] = useState(false);
    const [price, setPrice] = useState(1);
    const { TabPane } = Tabs;

    //const { chainId, wallet_addr } = useMoralisDapp();

   // const [wallet_addr, setwallet_addr] = useState(false);
   // const { wallet_addr } = useMoralisDapp();

    const contractProcessor = useWeb3ExecuteFunction();

    //const listItemFunction = "TLuNFTMarket";
    const listItemFunction = "createMarketItem";

    const [authUserWalletAddr,setAuthUserWalletAddr] = useState("")
    const [activeTab, setActiveTab] = useState(wallet_addr.tab_num);

    const [activeTabProf, setActiveTabProf] = useState(tab_num);

    //const wallet_addr ="0x742384239kfafeafeak"

    const [userType, setUserType] = useState('client')

    const [fileUrl, setFileUrl] = useState('')
    const [ImageUrl, setImageUrl] = useState(null)
    const [username, setUsername] = useState("Unnamed")
    const router = useRouter()


    function callback(key) {
        console.log("old active tab:", activeTab)
        setActiveTab(key)
        console.log("KEY BTW", key);
        console.log("wallet_addr", wallet_addr)
        console.log("tab_num:", tab_num)
        console.log("active tab:", activeTab)
        //Shallow routing doesn't actually refresh the page! Just changes the url
        router.push({
            pathname: '/profile/' + wallet_addr,
            query: { tab: key }
        },
            undefined, { shallow: true }
        )
    }

    function callback_personal_profile(key) {
        console.log("old active tab:", activeTab)
        setActiveTabProf(key)
        console.log("KEY BTW", key);
        console.log("wallet_addr", wallet_addr)
        console.log("tab_num:", tab_num)
        console.log("active tab:", activeTabProf)
        //Shallow routing doesn't actually refresh the page! Just changes the url
        router.push({
           pathname: '/profile',
           query: { tab: key }
        },
           undefined, { shallow: true }
        )
    }

    console.log("created nfts:", CreatedNFTs)

    useEffect(() => {
        if (loaded == 'false') {

            //const marketplace_nfts = Moralis.Object.extend("NFTMetadata");
            //const query = new Moralis.Query(marketplace_nfts);
            //const currentUser = Moralis.User.current();
            //console.log("currentUser:", currentUser)
            //console.log("currentUser user_type:", currentUser.attributes.user_type)
            //if (wallet_addr === "") {
            //    setAuthUserWalletAddr(Moralis.User.current().get("ethAddress"))
            //}

            fetch_random_user_profile_image().then(function (res) {
                try {
                    if (res.length > 0) {
                        //alert("MAJOR ALERT!")
                    }
                    setLoaded('true')
                }
                catch (e) {

                }

            })
            if (ImageUrl != null) {

                setLoaded('true')
            }

        }
        else {
            //console.log("market address:", marketAddress)
            setRand("rancid")
        }

    });

    async function fetch_random_user_profile_image() {
        //await Moralis.Cloud.run("sendEmailToSeller", params); 
        if (wallet_addr === "") {
            try {
                const currentUser = Moralis.User.current();
                console.log("CURRENT USER BTW:", currentUser)
                var params = { addr: currentUser?.get("ethAddress") || "0x2afe08789751e51f55fe1c0aabb0d89e6fa7e997"}
            } catch(e) {
                var params = { addr: wallet_addr }
            }

        } else {
            var params = { addr: wallet_addr }
        }
        try {
            await Moralis.Cloud.run("fetch_profile_image", params).then((res) => {
                //var res = res2[0]
                //var h = 3
                console.log("profile:", res)
                //console.log("H:")
                res = res[0]

                try {
                    console.log("here1")
                    console.log("IMAGE URL!:", res.attributes.brand_image)
                    console.log("here222")
                    if (res.attributes.username.length > 0) {
                        setUsername(res.attributes.username)
                    }
                    console.log("here2")

                    if (res.attributes.user_type.length > 0) {
                        console.log("GOLDEN USER TYPE:", res.attributes.user_type)
                        setUserType(res.attributes.user_type)
                    }

                    console.log("here3")
                    var img_url = res.attributes.brand_image
                    //setImageUrl(img_url)
                    if (img_url.length > 0) {
                        //alert("HELLO?????")
                        setImageUrl(res.attributes.brand_image)
                        console.log("Golden Set Image Url:", ImageUrl)
                        return res.attributes.brand_image
                    }
                }
                catch (e) {
                    console.log("handling expected error")
                }



            }, (error) => {
                // The object was not retrieved successfully.
                // error is a Moralis.Error with an error code and message.
            });
            console.log("USERS!!!:", res)
            return res

        }
        catch (e) {
            console.log("error!", e)
            //alert("david")
        }
    }




    async function fetch_profile_image() {
        console.log("Fetching profile image!")
        const User = Moralis.Object.extend("User");
        const query = new Moralis.Query(User);
        const currentUser = Moralis.User.current();
        console.log("current user:", currentUser)
        //query.equalTo("objectId",currentUser.objectId)
        //const results = await query.find();
        //var img_url = ""

        await query.get(currentUser.id).then((res) => {
            console.log("profile:", res)
            //res.set("minted", "true")
            //res.set("owner", currentUser)
            //res.set("token_id", parseInt(token_id))
            //res.set("list_price", listPrice)
            //res.set("brand_image",imageURI)
            //res.save()
            //alert("successfully updated restaurant's brand image!")
            // The object was retrieved successfully.

            try {
                console.log("IMAGE URL!:", res.attributes.brand_image)
                if (res.attributes.username.length > 0) {
                    setUsername(res.attributes.username)
                }
                if (res.attributes.user_type.length > 0) {
                    console.log("GOLDEN USER TYPE:", res.attributes.user_type)
                    setUserType(res.attributes.user_type)
                }


                var img_url = res.attributes.brand_image
                //setImageUrl(img_url)
                if (img_url.length > 0) {
                    //alert("HELLO?????")
                    setImageUrl(res.attributes.brand_image)
                    console.log("Golden Set Image Url:", ImageUrl)

                    return res.attributes.brand_image
                }
            }
            catch (e) {
                console.log("handling expected error")
            }



        }, (error) => {
            // The object was not retrieved successfully.
            // error is a Moralis.Error with an error code and message.
        });

        //return ""
    }

    async function onChange(e) {
        try {
            const file = e.target.files[0]
            console.log("File:", file)
            //const fileInput = document.getElementById("file");
            //const data = fileInput.files[0];
            const imageFile = new Moralis.File(file.name, file);
            await imageFile.saveIPFS();
            const imageURI = imageFile.ipfs();
            console.log("imageURI btw:", imageURI)
            setImageUrl(imageURI)
            setFileUrl(file)

            const User = Moralis.Object.extend("User");
            const query = new Moralis.Query(User);
            const currentUser = Moralis.User.current();
            console.log("current user:", currentUser)
            //query.equalTo("objectId",currentUser.objectId)
            //const results = await query.find();
            query.get(currentUser.id).then((res) => {
                console.log("profile:", res)

                res.set("brand_image", imageURI)
                res.save()

            }, (error) => {
                // The object was not retrieved successfully.
                // error is a Moralis.Error with an error code and message.
            });

        }
        catch (exception_var) {
            console.log("user didn't upload/change file.")
        }
    }

    function test() {

        console.log("active tab:", activeTabProf)
        console.log("wallet addr:", wallet_addr)
        //console.log("tab num:", tab_num)

    }

    //If the current user's wallet addr they just clicked on doesn't match the /profile/wallet_addr, render new <ProfileQuery> component that just has queries
    //with no minting/listing functionality
    if (!curr_user_match) {
        return (
            <>
                <div className="container">
                    <div className="flex flex-col justify-center items-center">

                        <label className="w-32 h-32  bg-green-300 border-solid border-1 rounded-full border-black hover:bg-gray-300">
                            <img className="h-32 w-32 object-fill rounded-full" width="" src={ImageUrl} />
                            {/* <input type='file' className="hidden" onChange={onChange} /> */}

                        </label>


                        {/* <div class='pt-7'>
                            <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full" >  Cloud</button>
                        </div> */}
                        <h1 className="font-bold text-3xl pt-4">{username}</h1>


                        <div className="text-gray-500 font-medium ">{wallet_addr.slice(0, 6) + "..." + wallet_addr.slice(wallet_addr.length - 4, wallet_addr.length)}</div>
                        <div className="text-gray-500 font-medium">Joined May 2022</div>
                    </div>

                    {/* <div>HELLO:{wallet_addr.wallet_addr.map(w => <div>{w.name}</div>)} */}
                    {/* </div> */}

                    {/* <button onClick={test}>CLCIK</button>F
                        <div>Tab that should be active:{tab_num}</div> */}

                    <div className="flex flex-col justify-center items-center pt-5">
                        <Tabs activeKey={tab_num} onChange={callback} className="flex flex-col justify-center items-center">
                            <TabPane tab="Collected" key="collected">
asaxa
                                {/* Content of Tab Pane 1  */}
                                {/* <Created/> */}

                                <ProfileQuery wallet_addr={wallet_addr} query_type={"collected"} />



                            </TabPane>
                            <TabPane tab="Listed" key="listed">
                                {/* Content of Tab Pane 2 */}
                                {/* <div></div>
                                    Component with inputs for listed query will go here */}
                                <ProfileQuery wallet_addr={wallet_addr} query_type={"listed"} />

                            </TabPane>

                            <TabPane tab="Created" key="created">
                                {/* Content of Tab Pane 2 */}
                                {/* <div></div>
                                    Component with inputs for listed query will go here */}
                                <ProfileQuery wallet_addr={wallet_addr} query_type={"created"} />

                            </TabPane>
                            {/* <TabPane tab="Tab 3" key="3">
                                    Content of Tab Pane 3
                                </TabPane> */}
                        </Tabs>
                    </div>
                </div>
            </>
        );
    }
    //Otherwise, render our old stuff as normal
    if (userType == 'restaurant') {
        return (
            <>
                <div className="container">
                    <div className="flex flex-col justify-center items-center">

                        <label className="w-32 h-32  bg-green-300 border-solid border-1 rounded-full border-black hover:bg-gray-300">
                            <img className="h-32 w-32 object-fill rounded-full" width="" src={ImageUrl} />
                            <input type='file' className="hidden" onChange={onChange} />

                        </label>


                        {/* <div class='pt-7'>
                            <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full" >  Cloud</button>
                        </div> */}
                        <h1 className="font-bold text-3xl pt-4">{username}</h1>
                        <div className="text-gray-500 font-medium ">{wallet_addr.slice(0, 6) + "..." + wallet_addr.slice(wallet_addr.length - 4, wallet_addr.length)}</div>


                        {/* <div className="text-gray-500 font-medium ">{Moralis.User.current()?.get("ethAddress").slice(0, 6) + "..." + Moralis.User.current()?.get("ethAddress").slice(Moralis.User.current()?.get("ethAddress").length - 4, Moralis.User.current()?.get("ethAddress").length)}</div> */}
                        <div className="text-gray-500 font-medium">Joined May 2022</div>
                    </div>

                    {/* <div>HELLO:{wallet_addr.wallet_addr.map(w => <div>{w.name}</div>)} */}
                    {/* </div> */}

                    {/* <button onClick={test}>CLCIK</button>F
                        <div>Tab that should be active:{tab_num}</div> */}

                    <div className="flex flex-col justify-center items-center pt-5">
                        <Tabs activeKey={activeTabProf} onChange={callback_personal_profile} className="flex flex-col justify-center items-center">
                            <TabPane tab="Created" key="created">

                                {/* Content of Tab Pane 1  */}
                                <Created/>

                                {/* <Bought /> */}



                            </TabPane>
                            <TabPane tab="Listed" key="listed">
                                {/* Content of Tab Pane 2 */}
                                {/* <div></div>
                                    Component with inputs for listed query will go here */}
                                <Listed />
                            </TabPane>
                            {/* <TabPane tab="Tab 3" key="3">
                                    Content of Tab Pane 3
                                </TabPane> */}
                        </Tabs>

                    </div>
                </div>
            </>
        );
    } else {
        return (
            <>
                <div className="container">
                    <div className="flex flex-col justify-center items-center">

                        <label className="w-32 h-32  bg-green-300 border-solid border-1 rounded-full border-black hover:bg-gray-300">

                            <img className="h-32 w-32 object-cover rounded-full" width="" src={ImageUrl} />


                            <input type='file' className="hidden" onChange={onChange} />

                        </label>
                        <h1 className="font-bold text-3xl pt-4">{username}</h1>
                        <div className="text-gray-500 font-medium ">{wallet_addr.slice(0, 6) + "..." + wallet_addr.slice(wallet_addr.length - 4, wallet_addr.length)}</div>

                        {/* <div className="text-gray-500 font-medium ">{Moralis.User.current().get("ethAddress").slice(0, 6) + "..." + Moralis.User.current()?.get("ethAddress").slice(Moralis.User.current()?.get("ethAddress").length - 4, Moralis.User.current()?.get("ethAddress").length)}</div> */}
                        <div className="text-gray-500 font-medium">Joined May 2022</div>
                    </div>
                    {/* <div class='pt-7'>
                        <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full" onClick={test}>  Cloud</button>
                    </div>

                    <button onClick={test}>CLCIK</button>F
                        <div>Tab that should be active:{tab_num}</div> */}

                    <div className="flex flex-col justify-center items-center pt-5">
                        <Tabs activeKey={activeTabProf} onChange={callback_personal_profile} className="flex flex-col justify-center items-center">
                            <TabPane tab="Collected" key="collected">
                                {/* Content of Tab Pane 1  */}
                                {/* <Created/> */}

                                <Bought />

                                {/* <ProfileQuery wallet_addr={authUserWalletAddr} query_type={"collected"} /> */}
                            </TabPane>
                            <TabPane tab="Listed" key="listed">
                                {/* Content of Tab Pane 2 */}
                                {/* <div></div>
                                    Component with inputs for listed query will go here */}
                                    <ListedClient />

                                {/* <ProfileQuery wallet_addr={authUserWalletAddr} query_type={"listed"} /> */}

                            </TabPane>
                            {/* <TabPane tab="Tab 3" key="3">
                                    Content of Tab Pane 3
                                </TabPane> */}
                        </Tabs>
                    </div>

                </div>
            </>
        );

    }
 
}

export default Profile;
