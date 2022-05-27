import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { Card, Tooltip, Modal, Input, Alert, Spin, Button } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useMoralisDapp  } from "providers/MoralisDappProvider/MoralisDappProvider";

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
    const [newervisibity,setnewerVisibility]= useState(false);
    const contractProcessor = useWeb3ExecuteFunction();
    //const listItemFunction = "TLuNFTMarket";
    const listItemFunction = "createMarketItem";
    //const contractABIJson = JSON.parse(contractABI);
    const contractABIJson2 = JSON.parse(contractABI);



    console.log("created nfts:", CreatedNFTs)

    useEffect(() => {

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

        } else {

            setRand("rancid")
        }

    });



    async function getJoined2() {
        //await Moralis.Cloud.run("sendEmailToSeller", params); 
        try {
            //const params_input = { inputValue: inputValue.toLowerCase() };
            const params_input = { owner: walletAddress };
            const results = await Moralis.Cloud.run("JoinMumbaiPassMarketWithAllCollectionsBought", params_input);
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
                    md.price = object.price / 1e18
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



    function succList() {
        let secondsToGo = 5;
        const modal = Modal.success({
            title: "Success!",
            content: `Your NFT was listed on the marketplace`,
        });
        setTimeout(() => {
            modal.destroy();
        }, secondsToGo * 1000);

    }

    function succApprove() {
        let secondsToGo = 5;
        const modal = Modal.success({
            title: "Success!",
            content: `Approval is now set, you may list your NFT`,
        });
        setTimeout(() => {
            modal.destroy();
        }, secondsToGo * 1000);
    }

    function failList() {
        let secondsToGo = 5;
        const modal = Modal.error({
            title: "Error!",
            content: `There was a problem listing your NFT`,
        });
        setTimeout(() => {
            modal.destroy();
        }, secondsToGo * 1000);
    }

    function failApprove() {
        let secondsToGo = 5;
        const modal = Modal.error({
            title: "Error!",
            content: `There was a problem with setting approval`,
        });
        setTimeout(() => {
            modal.destroy();
        }, secondsToGo * 1000);
    }

    async function approveAll(nft) {
        setLoading(true);
        const ops = {
            contractAddress: nft.addr,
            functionName: "setApprovalForAll",
            abi: [{ "inputs": [{ "internalType": "address", "name": "operator", "type": "address" }, { "internalType": "bool", "name": "approved", "type": "bool" }], "name": "setApprovalForAll", "outputs": [], "stateMutability": "nonpayable", "type": "function" }],
            params: {
                operator: "0xcc937ED5ab9A614a0660262f96882Edc08Bce1c4",
                approved: true
            },
        };

        await contractProcessor.fetch({
            params: ops,
            onSuccess: () => {
                console.log("Approval Received");
                setLoading(false);
                setVisibility(false);
                succApprove();
            },
            onError: (error) => {
                setLoading(false);
                failApprove();
            },
        });
    }


    function handleSellClick(nft, listPrice) {
        console.log("nasty nft:", nft)
        console.log("uri:", nft.image)
        console.log("market address:", marketAddress)
        //createSale(nft.uri)
        //query_test(nft)
        deploy(nft, listPrice)
    }

    const handleSellClick2 = (nft, index) => {
        console.log("nasty index clicked!:", index)
        console.log("nasty nft!:", nft)
        console.log("market address:", marketAddress)
        nft.index = index
        setNftToSend(nft);
        setVisibility(true);
    };

    async function redeemNFT(nft, index) {
        console.log("nasty index clicked!:", index)
        console.log("nasty nft!:", nft)
        console.log("market address:", marketAddress)
        nft.index = index
        //setNftToSend(nft);
        if(newervisibity){
        setnewerVisibility(false);
    }else{
        alert("already redeemed")
        setnewerVisibility(true);


    }

    };

    async function deploy(nft, listPrice) {
        //console.log("nft is in collection:",nft.collection.attributes.collection_name)

        console.log("NFT BTW:",nft)
     //   await approveAll(nft)
        //var listPrice2 = token_id
        //var listPrice2 = []
        //for (let i = 0; i < NumberNFTs; i++) {
        //  listPrice2.push(String(listPrice * ("1e" + 18)));
        //}

        var token_id_arr =  [String(nft.token_id)]
        console.log("token id array:",token_id_arr)
        
        list2(nft, listPrice, token_id_arr)
        /*       //alert("should be done minting. calling approve all")
              await approveAll(nft)
              //alert("should be done approving, and about to call list!")
              list(nft, listPrice, token_id)
              CreatedNFTs.splice(nft.index, 1);
              setCreatedNFTs(CreatedNFTs)
              perform_update(nft) */
        //}

    }



    async function list2(nft, listPrice, token_id_arr) {
        setLoading(true);
        const objectId = nft.objectId
        //const p = listPrice * ("1e" + 18);
        console.log("nft.collection.attributes.NFTsol_addr:", nft.addr)
        console.log("TYPEOF nft.collection.attributes.NFTsol_addr:", typeof(nft.addr))
        console.log("token_id_arr:",token_id_arr)
        console.log("market address:",marketAddress)
        console.log("list price:",listPrice)
        console.log(nft.collection.royalty_percent)
        const p = listPrice * ("1e" + 18);
        const ops = {
          contractAddress: marketAddress,
          functionName: "createMultiMarketItem",
          abi: contractABIJson2,
          params: {
            nftContract: nft.addr,
            //nftContract: "0x2c2611bca71f985e26f8beba5dde8b1b0a4186fe",
            tokenId: token_id_arr,
            //tokenId: token_id,
            price: String(p),
            royaltypercentage: String(nft.collection.royalty_percent),
          },
        };
    
        await contractProcessor.fetch({
          params: ops,
          onSuccess: () => {
            console.log("success");
            setLoading(false);
            setVisibility(false);
            //addItemImage();
            //updateSecondaryListedMarketItem(objectId)
            succList();
          },
          onError: (error) => {
            console.log("error:", error)
            alert("NASTY ERROR:", error)
            setLoading(false);
            failList();
          },
        });
    
      }



      async function updateSecondaryListedMarketItem(objectId) {
        //const id = getRealMarketItem(nftToBuy).objectId;
        //const id = objectId
        //console.log("ID:",id)
        const marketList = Moralis.Object.extend("MumbaiNFTMarketplaceTable");
        const query = new Moralis.Query(marketList);
        await query.get(objectId).then((obj) => {
            obj.set("sold", false);
            obj.set("owner", walletAddress);
            obj.set("seller", walletAddress);
            //obj.set("active", true);
            obj.save();
        });
        //nft.sold=false
        //nftToBuy.sold = true
        //setNftToBuy(nftToBuy)
    }





    if (!CreatedNFTs.length) return (
        <>
            <h1 className="block mb-2 text-2xl font-medium">No NFTs purchased yet!</h1>
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


                                <Tooltip title="List this NFT" key={index}>
                                    <ShoppingCartOutlined onClick={() => handleSellClick2(nft, index)} />
                                </Tooltip>,
                                <Tooltip title="Redeem this Parley" key={index}>
                                <ShoppingCartOutlined onClick={() => redeemNFT(nft, index)} />
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
                            <div className="div pb-1">{nft.collection.collection_name}</div>
                            <Meta title={nft.name} description={`#${nft.token_id}`} />

                        </Card>
                    ))}
            </div>

            <Modal
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
                        {/* <img className="h-64 w-60 object-fill p-5" width="" src={`${nftToSend?.couponImage}`} /> */}
                    </div>

                    {/*         <div className="div">
        {nftToSend.description !== null ? <div className="div pb-3">Description: {nftToSend.description}</div> : <div className="div"></div>}
        </div> */}



                    <div className="flex flex-row">
                        <span className="block mb-2 text-sm font-medium">Description: </span><span>&nbsp;{nftToSend?.description}</span>
                    </div>



                    <Input
                        autoFocus
                        placeholder="Listing Price in MATIC"
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </Spin>
            </Modal>



        </>
    );
}

export default Created;
