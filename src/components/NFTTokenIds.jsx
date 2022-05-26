import React, { useState, useEffect } from "react";
import { getNativeByChain } from "helpers/networks";
import axios from 'axios';
import {
    useMoralis,
    useMoralisQuery,
    useNewMoralisObject,
} from "react-moralis";
import { Card, Tooltip, Modal, Badge, Alert, Spin, Button } from "antd"; //missing Image
import {
    FileSearchOutlined,
    RightCircleOutlined,
    ShoppingCartOutlined,
} from "@ant-design/icons";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { getExplorer } from "helpers/networks";
import { useWeb3ExecuteFunction } from "react-moralis";
import { ethers, ContractFactory } from 'ethers'
import Web3Modal from 'web3modal'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Router from 'next/router'

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
    banner: {
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
        margin: "0 auto",
        width: "600px",
        //borderRadius: "10px",
        height: "150px",
        marginBottom: "40px",
        paddingBottom: "20px",
        borderBottom: "solid 1px #e3e3e3",

    },
    logo: {
        height: "115px",
        width: "115px",
        borderRadius: "50%",
        // positon: "relative",
        // marginTop: "-80px",
        border: "solid 4px white",
    },
    text: {
        color: "#041836",
        fontSize: "27px",
        fontWeight: "bold",
    },
};

function NFTTokenIds({ inputValue, setInputValue }) {
    const fallbackImg =
        "data:image/png;base64,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";
    //const { NFTTokenIds, totalNFTs, fetchSuccess } = useNFTTokenIds(inputValue);
    const [visible, setVisibility] = useState(false);
    const [nftToBuy, setNftToBuy] = useState(null);
    const [loading, setLoading] = useState(false);
    const contractProcessor = useWeb3ExecuteFunction();
    const { chainId, marketAddress, contractABI, walletAddress,CompanyWallet } =
        useMoralisDapp();
    const nativeName = getNativeByChain(chainId);
    const contractABIJson = JSON.parse(contractABI);
    const { Moralis, isAuthenticated } = useMoralis();
    const queryMarketItems = useMoralisQuery("MumbaiNFTMarketplaceTable");
    const fetchMarketItems = JSON.parse(
        JSON.stringify(queryMarketItems.data, [
            "objectId",
            "createdAt",
            "price",
            "nftContract",
            "itemId",
            "sold",
            "tokenId",
            "seller",
            "owner",
            "confirmed",
        ])
    );
    //const purchaseItemFunction = "createMarketSale";
    const purchaseItemFunction = "createMarketSaleRoyalties";
    //const NFTCollections = getCollectionsByChain(chainId);
    const [loaded, setLoaded] = useState('false')
    const [NFTTokenIds, setNFTTokenIds] = useState([])
    const [totalNFTs, setTotalNFTs] = useState(0)
    const [rand, setRand] = useState('blah')
    const [inputvaluetest, setInputValTest] = useState("")
    //const [fetchSuccess, setFetchSuccess] = useState(true)
    const fetchSuccess = true
    const [loadedCollections, setLoadedCollections] = useState(false);
    const [loadedUnauth, setloadedUnauth] = useState(false);

    //var NFTCollections = getCollectionsByChain(chainId);
    const [NFTCollections, setNFTCollections] = useState([]);



    //Hooks: First, there's a hook to get all the collections (see getCollections())
    //There's also a hook that gets all NFTs in each collection with their metadata...
    //GetJoined2 uses ethers to get the metadata, getJoined3 uses a double join cloud function...
    //GetJoined3 was made to fix unauthenticated bug --> this allows unauthenticated users to see all NFTs
    //in each collection
    useEffect(() => {
        console.log("State Update!: UseEffect being called!")
        console.log("fetchMarketItems:", fetchMarketItems)
        if (inputvaluetest != inputValue && isAuthenticated) {


            const MumbaiNFTMarketplaceTable = Moralis.Object.extend("MumbaiNFTMarketplaceTable");
            const query = new Moralis.Query(MumbaiNFTMarketplaceTable);
            //const currentUser = Moralis.User.current();
            //setCreatedNFTs(fetch(query,currentUser))
            getJoined2().then(function (res) {
                //console.log("RES!:", res)
                if (typeof res !== 'undefined') {
                    console.log("res",res)
                    if (res.length > 0) {
                        setNFTTokenIds(res)
                        
                        setTotalNFTs(res.length)
                        setInputValTest(inputValue)
                        //alert("MAJOR ALERT!")
                    }
                }
            })


        }

        if (inputvaluetest != inputValue && !isAuthenticated) {
            const MumbaiNFTMarketplaceTable = Moralis.Object.extend("MumbaiNFTMarketplaceTable");
            const query = new Moralis.Query(MumbaiNFTMarketplaceTable);
            //const currentUser = Moralis.User.current();
            //setCreatedNFTs(fetch(query,currentUser))
            getJoined3().then(function (res) {
                //console.log("RES!:", res)
                if (typeof res !== 'undefined') {
                    if (res.length > 0) {
                        setNFTTokenIds(res)
                        setTotalNFTs(res.length)
                        setInputValTest(inputValue)
                        //setloadedUnauth(true)
                        //alert("MAJOR ALERT!")
                    }
                }
            })
        }

        if (loadedCollections == false) {

            try {
                getCollections()
            } catch (e) {
            }
            setRand("rancid")
        }



    });



    async function getJoined3() {
        //await Moralis.Cloud.run("sendEmailToSeller", params); 
        //alert("HELLO???")
        try {
            const params_input = { inputValue: inputValue.toLowerCase() };
            const results = await Moralis.Cloud.run("JoinMumbaiPassMarketWithCollections2", params_input);
            //const currentUser = Moralis.User.current();
            //console.log("curr user:",currentUser)
            console.log("UNAUTHENTICATED!!!:", results)

            var nft_metadata = []
            if (typeof results !== 'undefined') {
                for (let i = 0; i < results.length; i++) {
                    console.log("i:",i)
                    var object = results[i];

                    //var object = object.record
                    //var object = results[i];
                    console.log("object:", object)
                    //var smart_contract_addr = object.attributes.nftContract
                    var smart_contract_addr = object.mumbai_pass_marketplace_collections[0].NFTsol_addr
                    var token_id = parseInt(object.tokenId)

                    console.log("TOKEN ID:", token_id)

                    //var tokenContract = new ethers.Contract(smart_contract_addr, NFT.abi, provider)
                    ////console.log("before token uri!")
                    //var tokenUri = await tokenContract.tokenURI(token_id)
                    var tokenURI = object.metadata[0].URI
                    //console.log("after token uri!")
                    //console.log("before token AXIOS!")
                    var meta = await axios.get(tokenURI)
                    //console.log("after token AXIOS!")
                    //console.log("meta:", meta)
                    let md = meta.data;
                    console.log("MD:", md)
                    //md.price 
                    md.seller = object.seller
                    md.sold = object.sold
                    md.objectId = object._id
                    md.itemID = object.itemId
                    md.price = object.price
                    md.collection = object.mumbai_pass_marketplace_collections[0]
                    md.addr = smart_contract_addr
                    md.token_id = token_id
                    nft_metadata.push(md)
                }
            }

            //console.log("NFT metadata:", nft_metadata)
            return nft_metadata
            // //return res

            //return []
        }
        catch (e) {
            //console.log("error!", e)
            //alert("david")
        }
    }

    async function getJoined2() {
        //await Moralis.Cloud.run("sendEmailToSeller", params); 
        //alert("HELLO???")
        try {
            //alert(inputValue.toLowerCase())
            const params_input = { inputValue: inputValue.toLowerCase() };
            const results = await Moralis.Cloud.run("JoinMumbaiPassMarketWithCollections", params_input);
            //const currentUser = Moralis.User.current();
            //console.log("curr user:",currentUser)
            console.log("results!!!:", results)
            //await Moralis.Cloud.run("sendEmailToUser",params);
            //alert("Successfully sent email to buyer!")
            const web3Modal = new Web3Modal()
            //console.log("BEFORE CONNECT")
            const connection = await web3Modal.connect()
            //console.log("AFTER CONNECT")
            const provider = new ethers.providers.Web3Provider(connection)
            //const signer = provider.getSigner()
            var nft_metadata = []

            if (typeof results !== 'undefined') {
                for (let i = 0; i < results.length; i++) {
                    var real_obj = results[i];
                    var object = real_obj.record
                    //var object = results[i];
                    console.log("object:", object)
                    //var smart_contract_addr = object.attributes.nftContract
                    var smart_contract_addr = object.mumbai_pass_marketplace_collections[0].NFTsol_addr
                    var token_id = parseInt(real_obj.objectId)
                    console.log("TOKEN ID:", token_id)
                    var tokenContract = new ethers.Contract(smart_contract_addr, NFT.abi, provider)
                    //console.log("before token uri!")
                    var tokenUri = await tokenContract.tokenURI(token_id)
                 //   console.log("TOKEN URI:", tokenUri)

                    //console.log("after token uri!")
                    //console.log("before token AXIOS!")
                    var meta = await axios.get(tokenUri)

                    //console.log("after token AXIOS!")
                    //console.log("meta:", meta)
                    let md = meta.data;
                    console.log("MD:", md)
                    console.log(object)

                    //md.price 
                    md.seller = object.seller
                    md.sold = object.sold
                    md.objectId = object._id
                    md.itemID = object.itemId
                    md.price = object.price
                    md.collection = object.mumbai_pass_marketplace_collections[0]
                    md.addr = smart_contract_addr
                    md.token_id = token_id
                    nft_metadata.push(md)
                }
            }

            //console.log("NFT metadata:", nft_metadata)
            return nft_metadata
            // //return res

            //return []
        }
        catch (e) {
            //console.log("error!", e)
            //alert("david")
        }
    }

    //This calls a cloud function that gets all collections, joins them on restaurant_id field with the Restaurant's object_id field.
    async function getCollections() {

        try {
            const res = await Moralis.Cloud.run("getCollectionLocations2");
            if (res.length > 0) {
                //console.log("RES!!!:", res)
                var arr = []
                for (var i = 0; i < res.length; i++) {
                    console.log("")
                    var coll = {
                        image:
                            res[i].image,
                        name: res[i].collection_name,
                        addrs: res[i].NFTsol_addr,
                        //These fields are from our joined results! --> have access to all restaurant fields
                        street_addr: res[i].collection_restaurant[0].address,
                        city: res[i].collection_restaurant[0].city,
                        state: res[i].collection_restaurant[0].state,
                        
                      
                    }
                    arr.push(coll)
                }
                
                setNFTCollections(arr)
                setLoadedCollections(true)
                return res
            }

        }
        catch (e) {
            console.log("error!", e)
            //alert("david")
        }
    }




    async function purchase() {
        setLoading(true);

        console.log(nftToBuy.collection.Minted_wallet)
        const objectId = nftToBuy.objectId
        const ops = {
            contractAddress: marketAddress,
            functionName: purchaseItemFunction,
            abi: contractABIJson,
            params: {
                // nftContract: nftToBuy.collection.attributes.NFTsol_addr,
                // itemId: itemID,

                nftContract: nftToBuy.addr,
                itemId: nftToBuy.itemID,
                OriginalMinter:nftToBuy.collection.Minted_wallet,
                CompanyWallet:CompanyWallet,
            },
            // msgValue: tokenPrice,
            msgValue: nftToBuy.price,
        };
        console.log(ops)

        var transaction = await contractProcessor.fetch({
            params: ops,
            onSuccess: (r) => {
                console.log("success");
                console.log("Transaction:", transaction)
                console.log("response:", r)
                setLoading(false);
                setVisibility(false);
                updateSoldMarketItem(objectId);
                succPurchase();
                findUserEmail(r.transactionHash)
            },
            onError: (error) => {
                console.log("error:", error)
                setLoading(false);
                failPurchase();
            },
        });

    }


    async function findUserEmail(transaction_hash) {

        const User = Moralis.Object.extend("User");
        const query = new Moralis.Query(User);
        //const currentUser = Moralis.User.current();
        //console.log("tokendetails:",td)
        console.log("transaction hash:",transaction_hash)
        var s1 = "https://mumbai.polygonscan.com/tx/"
        var real_url = s1.concat(transaction_hash)
        
        //alert("td.seller:",td.seller)
        //alert("seller:",seller)
        console.log("real url:", real_url)
        var listed_price = convert(nftToBuy?.price)
        console.log("price:",listed_price)
        //alert(real_url)
        const params_buer = { listPrice: listed_price, name: nftToBuy.name, tx: real_url };
        sendEmailToBuyer(params_buer);


        var params = { seller: nftToBuy.seller }
        console.log("seller:",nftToBuy.seller)
        var email = await getUsers(params)

        console.log("Email found:",email)

        const params2 = { listPrice: listed_price, name: nftToBuy.name, getEmail: email, tx: real_url };
        sendEmailToSeller(params2);
        //alert("successfully sent email!")

    }

    async function sendEmailToSeller(params) {
        //await Moralis.Cloud.run("sendEmailToSeller", params); 
        try {
            await Moralis.Cloud.run("sendEmailToSeller", params);
            //await Moralis.Cloud.run("sendEmailToUser",params);
            console.log("successfully sent email to seller!")
            //alert("Successfully sent email to seller!")

        }
        catch (e) {
            console.log("error!", e)
            alert("david")
        }
    }

    async function sendEmailToBuyer(params) {
        //await Moralis.Cloud.run("sendEmailToSeller", params); 
        try {
            await Moralis.Cloud.run("sendEmailToBuyer", params);
            //await Moralis.Cloud.run("sendEmailToUser",params);
            console.log("successfully sent email to buyer!")
            //alert("Successfully sent email to buyer!")

        }
        catch (e) {
            console.log("error!", e)
            alert("david")
        }
    }

    async function getUsers(params) {
        //await Moralis.Cloud.run("sendEmailToSeller", params); 
        try {
            const res = await Moralis.Cloud.run("getUsers", params);
            console.log("USERS!!!:", res)
            //await Moralis.Cloud.run("sendEmailToUser",params);
            //alert("Successfully sent email to buyer!")
            return res[0].attributes.email

        }
        catch (e) {
            console.log("error!", e)
            alert("david")
        }
    }




    const handleBuyClick = (nft) => {
        console.log("BUYING THIS NFT!:",nft)
        setNftToBuy(nft);
        console.log(nft.image);
        //console.log(nft.sold);
        setVisibility(true);
    };

    function succPurchase() {
        let secondsToGo = 5;
        const modal = Modal.success({
            title: "Success!",
            content: 'You have purchased this NFT',
        });
        setTimeout(() => {
            modal.destroy();
        }, secondsToGo * 1000);
    }

    function failPurchase() {
        let secondsToGo = 5;
        const modal = Modal.error({
            title: "Error!",
            content: 'There was a problem when purchasing this NFT',
        });
        setTimeout(() => {
            modal.destroy();
        }, secondsToGo * 1000);
    }

    async function updateSoldMarketItem(objectId) {

        const marketList = Moralis.Object.extend("MumbaiNFTMarketplaceTable");
        const query = new Moralis.Query(marketList);
        
        await query.get(objectId).then((obj) => {
            obj.set("sold", true);
            obj.set("owner", walletAddress);
            //obj.set("active", false);
            obj.save();
        });
        nftToBuy.sold = true
        setNftToBuy(nftToBuy)
    }


    function getDebug(nft) {
        console.log("GET REAL MARKET ITEM CALLED!")
        //const result2 = fetchMarketItems?.find(
        //  (e) =>
        //    e.nftContract === nft.collection.attributes.NFTsol_addr &&
        //    e.tokenId === nft.token_id

        //);
        console.log("nft:", nft)
        console.log("fetchMarketItems:", fetchMarketItems)
        try {
            for (let i = 0; i < fetchMarketItems.length; i++) {

                if (fetchMarketItems[i].nftContract.toString().toLowerCase() == nft.collection.attributes.NFTsol_addr.toString().toLowerCase()) {
                    if (nft.token_id === fetchMarketItems[i].tokenId) {
                        //alert("HERE!!")
                        console.log("index:", i)
                        console.log("Fetch Market Items:", fetchMarketItems[i])

                        //alert("SHOULD BE HERE!!!!!!")
                        //if (fetchMarketItems[i].sold === false) {
                        //alert("here?")
                        return fetchMarketItems[i];
                        //}

                    }
                }
            }

        }
        catch (e) {
            console.log("Nasty error!")
            console.log("error e:", e)
        }

        //console.log("nft:", nft)
        //console.log("addr:", nft?.collection.attributes.NFTsol_addr)
        //console.log("addr type (should be string)", typeof nft?.collection.attributes.NFTsol_addr)
        //console.log("token id:", nft?.token_id)
        //console.log("token id type (should be string)", typeof nft?.token_id)
        //console.log("the result!:",result2)
        //console.log("fetchMarketItems:",fetchMarketItems)

        return [];
    }



    function getRealMarketItem(nft) {
        //console.log("GET REAL MARKET ITEM CALLED!")
        //const result2 = fetchMarketItems?.find(
        //  (e) =>
        //    e.nftContract === nft.collection.attributes.NFTsol_addr &&
        //    e.tokenId === nft.token_id

        //);
        //console.log("nft:", nft)
        //console.log("fetchMarketItems:", fetchMarketItems)
        try {
            for (let i = 0; i < fetchMarketItems.length; i++) {
                //console.log("i:",i)
                //console.log("nft.collection.attributes.NFTsol_addr:",nft.collection.attributes.NFTsol_addr.toString().toLowerCase())
                //console.log("fetchMarketItems[i].nftContract:",fetchMarketItems[i].nftContract.toString().toLowerCase())
                //console.log("TYPE OF nft.collection.attributes.NFTsol_addr:",typeof nft.collection.attributes.NFTsol_addr)
                //console.log("TYPE OF fetchMarketItems[i].nftContract:",typeof fetchMarketItems[i].nftContract)   
                //console.log("is this equal?:",fetchMarketItems[i].nftContract.toString().toLowerCase() == nft.collection.attributes.NFTsol_addr.toString().toLowerCase())    

                if (fetchMarketItems[i].nftContract.toString().toLowerCase() == nft.collection.attributes.NFTsol_addr.toString().toLowerCase()) {
                    if (nft.token_id === fetchMarketItems[i].tokenId) {
                        //alert("HERE!!")
                        //console.log("index:",i)
                        //console.log("Fetch Market Items:", fetchMarketItems[i])
                        return fetchMarketItems[i];
                        //}

                    }
                }
            }

        }
        catch (e) {
            //console.log("Nasty error!")
            //console.log("error e:", e)
        }



        return [];
    }



    function getUrl(nft) {
        var s1 = "https://testnet.snowtrace.io/address/"
        var s2 = nft.collection.attributes.NFTsol_addr
        return s1.concat(s2)
    }


    async function cloud_func() {
        const currentUser = Moralis.User.current();
        console.log("current User:", currentUser.id)
        var params = { seller: "0x1676b3E4282AeA747BC64E955E939Af7e920A2bf".toLowerCase(), user: currentUser.id }
        getJoined(params)
    }

    async function getJoined(params) {
        //await Moralis.Cloud.run("sendEmailToSeller", params); 
        try {
            const res = await Moralis.Cloud.run("JoinMumbaiPassMarketWithCollections");
            //const currentUser = Moralis.User.current();
            //console.log("curr user:",currentUser)
            console.log("RES!!!:", res)
            //await Moralis.Cloud.run("sendEmailToUser",params);
            //alert("Successfully sent email to buyer!")



            return res
        }
        catch (e) {
            console.log("error!", e)
            alert("david")
        }
    }


    function convert(input_price) {
        return String(parseInt(input_price) / 1e18)
    }



    async function cloud2() {
        const params_input = { inputValue: inputValue.toLowerCase() };
        const results = await Moralis.Cloud.run("JoinMumbaiPassMarketWithCollections2", params_input);
        //const currentUser = Moralis.User.current();
        //console.log("curr user:",currentUser)
        console.log("results!!!:", results)

    }

    function onChangeselect(value) {
        Router.push({
            pathname: '/nftmarketplace',
            query: { id: value},
        })
    }

    return (
        <>
            <div>
                {contractABIJson.noContractDeployed && (
                    <>
                        <Alert
                            message="No Smart Contract Details Provided. Please deploy smart contract and provide address + ABI in the MoralisDappProvider.js file"
                            type="error"
                        />
                        <div style={{ marginBottom: "10px" }}></div>
                    </>
                )}
                {inputValue !== "explore" && totalNFTs !== undefined && (
                    <>
                        {!fetchSuccess && (
                            <>
                                <Alert
                                    message="Unable to fetch all NFT metadata... We are searching for a solution, please try again later!"
                                    type="warning"
                                />
                                <div style={{ marginBottom: "10px" }}></div>
                            </>
                        )}
                        <div style={styles.banner}>
                            {<img
                                preview="false"
                                src={NFTTokenIds[0]?.image || "error"}
                                fallback={fallbackImg}
                                alt=""
                                style={styles.logo}
                            />}
                            <div style={styles.text}>
                                <>
                                    <div>{`${NFTTokenIds[0]?.collection.collection_name}`}</div>
                                    <div
                                        style={{
                                            fontSize: "15px",
                                            color: "#9c9c9c",
                                            fontWeight: "normal",
                                        }}
                                    >
                                        Collection Size: {`${totalNFTs}`}
                                    </div>
                                </>
                            </div>
                        </div>
                    </>
                )}

                <div style={styles.NFTs}>
                    {inputValue === "explore" &&
                        NFTCollections?.map((nft, index) => (
                            <Card
                                hoverable
                                actions={[
                                    <Tooltip title="View Collection" key={index}>
                                        <RightCircleOutlined
                                            onClick={() => onChangeselect(nft?.addrs)}
                                        />
                                    </Tooltip>,
                                ]}
                                style={{ width: 240, border: "2px solid #e7eaf3" }}
                                cover={
                                    <img
                                        preview="false"
                                        src={nft?.image || "error"}
                                        fallback={fallbackImg}
                                        alt=""
                                        style={{ height: "240px" }}
                                    />
                                }
                                key={index}
                            >
                                <Meta title={nft.name} />
                                <div className="div">{nft.street_addr}, {nft.city}, {nft.state} </div>

                            </Card>
                        ))}

                    {inputValue !== "explore" &&
                        NFTTokenIds.slice(0, 40).map((nft, index) => (
                            <Card
                                hoverable
                                actions={[
                                    <Tooltip title="View On Blockexplorer" key={index}>
                                        <FileSearchOutlined
                                            onClick={() =>
                                                window.open(
                                                    getUrl(nft),
                                                    "_blank"
                                                )
                                            }
                                        />
                                    </Tooltip>,
                                    <Tooltip title="Buy NFT" key={index}>
                                        <ShoppingCartOutlined onClick={() => handleBuyClick(nft)} />
                                    </Tooltip>,
                                ]}
                                style={{ width: 240, border: "2px solid #e7eaf3" }}
                                cover={
                                    <a href={"/collection/"+inputValue+"/"+nft.token_id}> 
                                    <img
                                        preview="false"
                                        src={nft.image || "error"}
                                        fallback={fallbackImg}
                                        alt=""
                                        style={{ height: "240px" }}
                                    />
                                  </a>

                                }
                                key={index}
                            >
                                {/* {getRealMarketItem(nft) && (

                                    // <div className="div">{nft.collection.attributes.collection_name}</div>
                                )} */}
                                <Meta title={nft.name} description={`#${nft.token_id}`} />
                            </Card>
                        ))}
                </div>



                {/*                 {nftToBuy == null ? (
                    <div className="div">

                    </div>
                ) : (
                    <div class='pt-7'>
                        <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full">  LOADED</button>
                    </div>
                )} */}

                {/* <div class='pt-7'>
                    <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full " onClick={cloud2}> Cloud</button>
                </div> */}


                <div className="some-container">
                    {
                        (() => {
                            if (nftToBuy == null)
                                //alert("HERE")
                                return
                            if (nftToBuy.sold == false) {
                                //alert("HERE!!!")
                                return <Modal
                                    title={`Buy ${nftToBuy?.name} #${nftToBuy?.token_id}`}
                                    visible={visible}
                                    onCancel={() => setVisibility(false)}
                                    onOk={() => purchase()}
                                    okText="Buy"
                                >
                                    <Spin spinning={loading}>


                                        <div className="flex flex-col justify-center items-center">
                                            <img className="h-64 w-60 object-fill p-5" width="" src={`${nftToBuy?.image}`} />
                                            {/* <img className="h-64 w-60 object-fill p-5" width="" src={`${nftToBuy?.couponImage}`} /> */}
                                        </div>


                                        <div className="flex flex-row">
                                            <span className="block mb-2 text-sm font-medium">Description: </span><span>&nbsp;{nftToBuy?.description}</span>
                                        </div>
                                        <div className="flex flex-row">
                                            <span className="block mb-2 text-sm font-medium">Listed for: </span><span>&nbsp;{convert(nftToBuy?.price)}&nbsp;Matic</span>
                                        </div>

                                        {/*               <div class='pt-7'>
                            <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full" onClick={findUserEmail2}>  EMAIL!</button>
                        </div> */}


                                    </Spin>
                                </Modal>
                            }


                            else {
                                //alert("here3")
                                return <Modal
                                    title={`Buy ${nftToBuy?.name} #${nftToBuy?.token_id}`}
                                    visible={visible}
                                    onCancel={() => setVisibility(false)}
                                    onOk={() => setVisibility(false)}
                                >
                                    <img
                                        src={nftToBuy?.image}
                                        style={{
                                            width: "250px",
                                            margin: "auto",
                                            borderRadius: "10px",
                                            marginBottom: "15px",
                                        }}
                                    />

                                    <Alert
                                        message="This NFT is currently not for sale"
                                        type="warning"
                                    />
                                </Modal>
                            }

                        })()
                    }
                </div>





                {/* <div class='pt-7'>
                    <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full" onClick={cloud_func}>  Cloud</button>
                </div> */}
            </div>

        </>
    );
}

export default NFTTokenIds;