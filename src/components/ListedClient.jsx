import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { Card, Tooltip, Modal, Input, Alert, Spin, Button } from "antd";
import { FileSearchOutlined, SendOutlined, ShoppingCartOutlined, SearchOutlined } from "@ant-design/icons";
import { useMoralisDapp, marketAddress, contractABI } from "providers/MoralisDappProvider/MoralisDappProvider";
import { useWeb3ExecuteFunction } from "react-moralis";
import axios from 'axios';
import { ethers, ContractFactory } from 'ethers'
import Web3Modal from 'web3modal'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'


const nftaddress = "0xb7F48F75348213e2F739f2C4026C6242f9526b8c"


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

function Created() {
    const [CreatedNFTs, setCreatedNFTs] = useState([]);
    const { Moralis, enableWeb3 } = useMoralis();
    const [loaded, setLoaded] = useState('false')
    const [rand, setRand] = useState('blah')
    const [loading, setLoading] = useState(false);
    const [nftToSend, setNftToSend] = useState(null);
    const [visible, setVisibility] = useState(false);
    const [price, setPrice] = useState(1);
    const { chainId, marketAddress, contractABI, walletAddress } = useMoralisDapp();
    const contractProcessor = useWeb3ExecuteFunction();
    //const listItemFunction = "TLuNFTMarket";
    const listItemFunction = "createMarketItem";
    const contractABIJson = JSON.parse(contractABI);


    console.log("created nfts:", CreatedNFTs)

    //useEffect(() => {
    //
    //    if (loaded == 'false') {
    //        const marketplace_nfts = Moralis.Object.extend("NFTMetadata");
    //        const query = new Moralis.Query(marketplace_nfts);
    //        const currentUser = Moralis.User.current();
    //        console.log("currentUser:", walletAddress)
    //        //setCreatedNFTs(fetch(query,currentUser))
    //        fetch(query, currentUser).then(function (res) {
    //            if (res.length > 0) {
    //                //alert("MAJOR ALERT!")
    //                //alert("found boys!",res.length)
    //            }
    //            console.log("res:", res)
    //            setCreatedNFTs(res)
    //            setLoaded('true')
    //        })
    //
    //
    //    } else {
    //        console.log("market address:", marketAddress)
    //        setRand("rancid")
    //    }
    //
    //});
    //


    useEffect(() => {
        console.log("State Update!: UseEffect being called!")
        if (loaded == 'false') {
            const MumbaiNFTMarketplaceTable = Moralis.Object.extend("MumbaiNFTMarketplaceTable");
            const query = new Moralis.Query(MumbaiNFTMarketplaceTable);
            //const currentUser = Moralis.User.current();
            //setCreatedNFTs(fetch(query,currentUser))
            getJoined2().then(function (res) {
                //console.log("RES!:", res)
                if (typeof res !== 'undefined') {
                    if (res.length > 0) {
                        setCreatedNFTs(res)
                        //setNFTTokenIds(res)
                        //setTotalNFTs(res.length)
                        //setInputValTest(inputValue)
                        //alert("MAJOR ALERT!")
                        setLoaded('true')
                    }
                }

            })

        }

        else {
            //console.log("market address:", marketAddress)
            setRand("rancid")
        }
    });


    async function getJoined2() {
        //await Moralis.Cloud.run("sendEmailToSeller", params); 
        try {
            const params_input = { seller: walletAddress };
            const results = await Moralis.Cloud.run("JoinMumbaiPassMarketWithAllCollections",params_input);
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
            const signer = provider.getSigner()
            var nft_metadata = []
            if (typeof results !== 'undefined') {
                for (let i = 0; i < results.length; i++) {
                    //console.log("i:",i)
                    var object = results[i];
                    //console.log("object:",object)
                    //var smart_contract_addr = object.attributes.nftContract
                    var smart_contract_addr = object.mumbai_pass_marketplace_collections[0].NFTsol_addr
                    var token_id = parseInt(object.tokenId)
                    var tokenContract = new ethers.Contract(smart_contract_addr, NFT.abi, provider)
                    //console.log("before token uri!")
                    var tokenUri = await tokenContract.tokenURI(token_id)
                    //console.log("after token uri!")
                    //console.log("before token AXIOS!")
                    var meta = await axios.get(tokenUri)
                    //console.log("after token AXIOS!")
                    //console.log("meta:", meta)
                    let md = meta.data;
                    //md.price 


                    //console.log("rancid object ID:",object.objectId)
                    //md.sold = object.sold

                    md.sold = object.sold

                    md.objectId = object.objectId
                    md.itemID = object.itemId
                    md.price = object.price/1e18
                    md.collection = object.mumbai_pass_marketplace_collections[0]
                    md.addr = smart_contract_addr
                    md.token_id = token_id
                    nft_metadata.push(md)
                }
            }

            console.log("NFT metadata:", nft_metadata)
            return nft_metadata
            // //return res
        }
        catch (e) {
            console.log("error!", e)
            //alert("david")
        }
    }






    async function fetch(query, currentUser) {
        //console.log("CU:",walletAddress)
        //query.equalTo("URI", "https://ipfs.moralis.io:2053/ipfs/QmejP9QfyVF4LNc28T4ASbLLyrwzopWDZ9g5dGqx2mrAGo");
        //query.equalTo("owner", walletAddress);
        query.equalTo("CurrUser", currentUser);
        query.equalTo("minted", "true");
        const results = await query.find();


        var nft_metadata = []
        console.log("res:", results)
        for (let i = 0; i < results.length; i++) {
            const object = results[i];
            console.log("obj:", object)
            //console.log(object.id + ' - ' + object.get('CurrUser'));
            //console.log(object.id + ' - ' + object.get('URI'));
            //console.log("--")
            //var myVar = object.attributes.Collection.attributes.collection_name
            //console.log("HOO:",myVar)
            var myVar = object.get("Collection")
            var garbage = null
            if (typeof myVar !== 'undefined') {
                garbage = object.attributes.Collection
                //console.log("myVar:",myVar)
                //console.log(myVar.)
            }
            //console.log("Collection:",object.get("Collection").get("collection_name"))
            console.log("object id:", object.id)


            axios.get(object.get('URI'))
                .then(res => {
                    let metadata = res.data;
                    //console.log("metadata:",metadata)
                    metadata.uri = object.get('URI')
                    metadata.list_price = object.get('list_price')
                    //metadata.collection = object.get("Collection")
                    metadata.collection = garbage
                    metadata.id2 = object.id
                    //console.log("metadata:",metadata)
                    nft_metadata.push(metadata);

                })
        }

        return nft_metadata;
    }

    function handleSellClick(nft, listPrice) {
        console.log("nasty nft:", nft)
        console.log("uri:", nft.uri)
        console.log("market address:", marketAddress)
        //createSale(nft.uri)
        //query_test(nft)
        //deploy(nft,listPrice)
    }

    const handleSellClick2 = (nft, index) => {
        console.log("nasty index clicked!:", index)
        console.log("nasty nft!:", nft)
        console.log("market address:", marketAddress)
        nft.index = index
        setNftToSend(nft);
        setVisibility(true);
    };




    function log() {
        var a = 4;
    }

    function getUrl(nft) {
        var s1 = "https://testnet.snowtrace.io/address/"
        var s2 = nft.collection.attributes.NFTsol_addr
        return s1.concat(s2)
    }


    if (!CreatedNFTs.length) return (
        <>
            <h1 className="block mb-2 text-2xl font-medium">No NFTs found listed!</h1>
        </>
    )

    //console.log(Created);
    return (
        <>
            <div style={styles.NFTs}>
                {CreatedNFTs &&
                    CreatedNFTs.map((nft, index) => (
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

                                <Tooltip title="View this NFT" key={index}>
                                    <SearchOutlined onClick={() => handleSellClick2(nft, index)} />
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
                            <div className="div pb-1">{nft.collection.collection_name}</div>
                            <Meta title={nft.name} description={`#${nft.token_id}`} />
                            {/* <Meta title={nft.name} description={nft.token_address} /> */}


                        </Card>
                    ))}
            </div>

            <Modal
                title={`${nftToSend?.name} is currently for sale on the marketplace!`}
                visible={visible}

                onCancel={() => setVisibility(false)}
                onOk={() => log()}
                okText="List"
                footer={[
                    <Button type="primary" onClick={() => setVisibility(false)} key={nftToSend?.index}>
                        Cancel
                    </Button>,

                ]}
            >
                <Spin spinning={loading}>
                    <div className="flex flex-col justify-center items-center">
                        <img className="h-64 w-60 object-fill p-5" width="" src={`${nftToSend?.image}`} />
                        {/* <img className="h-64 w-60 object-fill p-5" width="" src={`${nftToSend?.couponImage}`} /> */}
                    </div>

                    {/*         <div className="div">
        {nftToSend.description !== null ? <div className="div pb-3">Description: {nftToSend.description}</div> : <div className="div"></div>}
        </div> */}

                    <div className="flex flex-row">
                        <span className="block mb-2 text-sm font-medium">Description: </span><span>&nbsp;{nftToSend?.description}</span>
                    </div>
                    <div className="flex flex-row">
                        <span className="block mb-2 text-sm font-medium">Listed for: </span><span>&nbsp;{nftToSend?.price}&nbsp;Matic</span>
                    </div>


                </Spin>
            </Modal>



        </>
    );
}

export default Created;
