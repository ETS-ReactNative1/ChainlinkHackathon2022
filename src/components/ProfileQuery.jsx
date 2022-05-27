import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { Card, Tooltip, Modal, Input, Alert, Spin, Button } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import axios from 'axios';
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

//What this Component does:
//Hook queries user's collected NFTS (default, tab 1)
//Users can switch to other tabs, changes url query parameters to match the tab and change the query (ex: All the NFTs that the user has currently listed, tab 2)
//Can add more tabs into this later

//When this Component is used: 
//When going to another user's profile page, can see all the NFTs they have collected or listed. Will be adding more tabs later.
//This component is ideally how we want all user profiles to work as (in other words, separate all the creating/minting/deploying/listing functionality AWAY
//from the user profile page --> this functionality should be achievable in the particular NFT Detail's page, probably not in the profile page)

function Created({ wallet_addr = "0x3204ce447d0e70f0b3fda25ce134c67314f36c7a", query_type = "collected" }) {
    const [CreatedNFTs, setCreatedNFTs] = useState([]);
    const { Moralis, enableWeb3 } = useMoralis();
    const [loaded, setLoaded] = useState('false')
    const [rand, setRand] = useState('blah')
    const [nftToSend, setNftToSend] = useState(null);
    const [visible, setVisibility] = useState(false);
    const { chainId, marketAddress, } = useMoralisDapp();

    //const [userQueries, setUserQueries] = useState([]);
    //const [loadedUsers, setLoadedUsers] = useState(false);

    console.log("created nfts:", CreatedNFTs)
    useEffect(() => {
        if (loaded == 'false') {

            if (query_type == "collected" || query_type == "listed") {
                getJoined2().then(function (res) {
                    if (typeof res !== 'undefined') {
                        if (res.length > 0) {
                            setCreatedNFTs(res)
                            setLoaded('true')
                        }
                    }
                })
            } else {
                const NFTMetadata = Moralis.Object.extend("NFTMetadata");
                const query = new Moralis.Query(NFTMetadata);
                //const currentUser = Moralis.User.current();
                fetch(query, wallet_addr).then(function (res) {
                    if (res.length > 0) {
                    }
                    console.log("res:", res);
                    setCreatedNFTs(res)
                    setLoaded('true')
                })
            }


        } else {
            setRand("rancid")
        }

        //if (!loadedUsers) {
        //    search_users().then(function (res) {
        //            if (typeof res !== 'undefined') {
        //                if (res.length > 0) {
        //                    console.log("Users btw:",res)
        //                    setUserQueries(res)
        //                    setLoadedUsers(true)
        //                }
        //            }
        //    })
        //}

    });


    async function search_users() {
        try {
            const results = await Moralis.Cloud.run("search_users");
            if (typeof results !== 'undefined') {
                if (results.length > 0) {
                    return results
                }
            }
            return results
        }
        catch (e) {
            //console.log("error!", e)
            //console.log("david")
        }
    }


    async function parse_results(results) {
        console.log("parse results!")
        var nft_metadata = []
        if (typeof results !== 'undefined') {
            for (let i = 0; i < results.length; i++) {
                console.log("i:", i)
                var object = results[i];
                console.log("object:", object)
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
                //console.log("MD:", md)
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
        return nft_metadata
    }

    async function getJoined2() {
        console.log("calling joined2 updatedd")
        try {
            //const params_input = { inputValue: inputValue.toLowerCase() };
            //Owner is used for bought.jsx ... seller is used for listedclient
            const params_input = { owner: wallet_addr, seller: wallet_addr };
            if (query_type === 'collected') {
                const results = await Moralis.Cloud.run("JoinMumbaiPassMarketWithAllCollectionsBought", params_input);
                console.log("Collected results:", results)
                return parse_results(results)
            } else {
                const results = await Moralis.Cloud.run("JoinMumbaiPassMarketWithAllCollections", params_input);
                console.log("Listed Client results:", results)
                return parse_results(results)
            }
        }
        catch (e) {
            console.log("error!", e)
            //alert("david")
        }
    }

    async function fetch(query, addr) {
        query.equalTo("orig_creator", addr.toString().toLowerCase());
        query.equalTo("minted", "false");
        const results = await query.find();
        var nft_metadata = []
        console.log("res:", results)
        for (let i = 0; i < results.length; i++) {
            const object = results[i];
            console.log("obj:", object)
            var myVar = object.get("Collection")
            var garbage = null
            if (typeof myVar !== 'undefined') {
                garbage = object.attributes.Collection
            }
            var meta = await axios.get(object.get('URI'))
            var metadata = meta.data;
            //console.log("metadata:",metadata)
            metadata.uri = object.get('URI')
            //metadata.collection = object.get("Collection")
            metadata.collection = garbage
            metadata.id2 = object.id
            console.log(typeof (metadata))
            //console.log("metadata:",metadata)
            nft_metadata.push(metadata);
        }

        return nft_metadata;
    }




    const handleSellClick2 = (nft, index) => {
        console.log("nasty index clicked!:", index)
        console.log("nasty nft!:", nft)
        console.log("market address:", marketAddress)
        nft.index = index
        setNftToSend(nft);
        setVisibility(true);
    };







    function print() {
        console.log("userQueries:", userQueries);
    }




    if (!CreatedNFTs.length) return (
        <>
            <h1 className="block mb-2 text-2xl font-medium">No NFTs purchased yet!</h1>
        </>
    )

    return (
        <>

            {/* <div className='pt-7'>
                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full" onClick={print}>  Print</button>
            </div> */}

            {/* <div style={styles.NFTs}>
                {userQueries &&
                    userQueries.slice(1,userQueries.length).map((user, index) => (
                        <div>
                            {user.get("ethAddress") + " index:" + index + 1}

                        </div>
                    ))}
            </div> */}

            <div style={styles.NFTs}>
                {CreatedNFTs &&
                    CreatedNFTs.map((nft, index) => (
                        <Card
                            hoverable
                            actions={[


                                <Tooltip title="View this NFT" key={index}>
                                    <ShoppingCartOutlined onClick={() => handleSellClick2(nft, index)} />
                                </Tooltip>,
                 

                            ]}
                            style={{ width: 240, border: "2px solid #e7eaf3" }}
                            cover={
                                <img
                                    preview={false}
                                    src={nft?.image || "error"}
                                    fallback="data:image/png;base64,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"
                                    alt=""
                                    style={{ height: "300px" }}
                                />
                            }
                            key={index}
                        >
                            {/* <div className="div pb-1">{nft.collection.attributes.collection_name}</div> */}


                            <div className="div pb-1">

                                {query_type != "created" ? nft.collection.collection_name : nft.collection.attributes.collection_name}

                            </div>

                            {/* <Meta title={nft.name} description={`#${nft.token_id}` ? query_type == "created" : <div>Note yet created</div>} /> */}

                            <Meta title={nft.name} description={query_type != "created" ? `#${nft.token_id}` : ""} />


                        </Card>
                    ))}
            </div>





            {/* <Modal
                title={`List ${nftToSend?.name} For Sale`}
                visible={visible}

                onCancel={() => setVisibility(false)}
                onOk={() => handleSellClick(nftToSend, price)}
                okText="List"
                footer={[
                    <Button onClick={() => setVisibility(false)} type="primary" key={nftToSend?.index}>
                        Cancel
                    </Button>,
                    <Button onClick={() => handleSellClick(nftToSend, price)} type="primary" key={nftToSend?.index}>
                        List
                    </Button>
                ]}
            >
                <Spin spinning={loading}>
                    <div className="flex flex-col justify-center items-center">
                        <img className="h-64 w-60 object-fill p-5" width="" src={`${nftToSend?.image}`} />
                    </div>


                    <div className="flex flex-row">
                        <span className="block mb-2 text-sm font-medium">Description: </span><span>&nbsp;{nftToSend?.description}</span>
                    </div>
                    <Input
                        autoFocus
                        placeholder="Listing Price in MATIC"
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </Spin>
            </Modal> */}



        </>
    );
}

export default Created;
