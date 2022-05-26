import React,  { useEffect, useState } from "react";
import { useMoralis, useMoralisQuery } from "react-moralis";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { Table, Tag } from "antd";
const styles = {
  table: {
    margin: "0 auto",
    width: "1000px",
  },
};

function NFTMarketAnalytics() {
  const { walletAddress } = useMoralisDapp();
  const { Moralis } = useMoralis();
  const [CreatedNFTs, setCreatedNFTs] = useState({});
  const [loaded, setLoaded] = useState('false')
  const [rand, setRand] = useState('blah')

 
  useEffect(() => {
    console.log("State Update!: UseEffect being called!")
    if (loaded == 'false') {
        //const currentUser = Moralis.User.current();
        //setCreatedNFTs(fetch(query,currentUser))
        getJoined2().then(function (res) {
            //console.log("RES!:", res)
            if (typeof res !== 'undefined') {
                if (Object.keys(res).length > 0) {
                    console.log("res:", res);

                    setCreatedNFTs(res)
                    console.log("this:",CreatedNFTs)


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
      const params_input = { minter: walletAddress };
      const results = await Moralis.Cloud.run("JoinMumbaiPassMarketWithAllCollectionsSold",params_input);
      //const currentUser = Moralis.User.current();
      //console.log("curr user:",currentUser)
      console.log("results!!!:", results)
      //await Moralis.Cloud.run("sendEmailToUser",params);
      //alert("Successfully sent email to buyer!")
      var nft_metadata = {}
     // var price = 0

      //nft_metadata['']=item
      console.log("NFTMETADATA:",nft_metadata)
      if (typeof results !== 'undefined') {
          for (let i = 0; i < results.length; i++) {
              //console.log("i:",i)
              var object = results[i];
              var item = {
                collection:"",
                sold:0,
                resold:0,
                revenue:0
              }
              if(Object.keys(nft_metadata).includes(object.mumbai_pass_marketplace_collections[0].collection_name )){
                if(object.seller==walletAddress){
                  item.revenue = nft_metadata[object.mumbai_pass_marketplace_collections[0].collection_name].revenue+0.975*object.price/1e18
                  item.collection=object.mumbai_pass_marketplace_collections[0].collection_name
                  item.sold=nft_metadata[object.mumbai_pass_marketplace_collections[0].collection_name].sold+1
                  item.resold=nft_metadata[object.mumbai_pass_marketplace_collections[0].collection_name].resold
              }else{
                item.revenue = nft_metadata[object.mumbai_pass_marketplace_collections[0].collection_name].revenue+object.mumbai_pass_marketplace_collections[0].royalty_percent*object.price/1e18/100
                item.collection=object.mumbai_pass_marketplace_collections[0].collection_name
                item.sold=nft_metadata[object.mumbai_pass_marketplace_collections[0].collection_name].sold
                item.resold=nft_metadata[object.mumbai_pass_marketplace_collections[0].collection_name].resold+1
              }
            }
              else{
              if(object.seller==walletAddress){
                item.revenue = 0.975*object.price/1e18
                item.collection=object.mumbai_pass_marketplace_collections[0].collection_name
                item.sold=1
                item.resold=0
              }else{
                item.revenue = object.mumbai_pass_marketplace_collections[0].royalty_percent*object.price/1e18/100
                item.collection=object.mumbai_pass_marketplace_collections[0].collection_name
                item.sold=0
                item.resold=1
              }
            }
            console.log(Object.keys(nft_metadata))
            console.log("item:",item)
            nft_metadata[object.mumbai_pass_marketplace_collections[0].collection_name]=item
            console.log(nft_metadata)
              
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



  const columns = [
    {
      title: "Collection",
      dataIndex: 'collection',
      key: "collection",
    },

    {
      title: "Sold",
      dataIndex: 'sold',
      key: "sold",
    },

    {
      title: "Resold",
      dataIndex: "resold",
      key: "resold",
    },
    {
      title: "Revenue Generated",
      dataIndex: "revenue",
      key: "revenue",
    }
  ];

  const data = Object.keys(CreatedNFTs)?.map((item, index) => ({
    collection: CreatedNFTs[item].collection,
    sold: CreatedNFTs[item].sold,
    resold:CreatedNFTs[item].resold,
    revenue: Math.round( CreatedNFTs[item].revenue* 100)/100
  }));

  return (
    <>
      <div>
        <div style={styles.table}>
          <Table columns={columns} dataSource={data} />
        </div>
      </div>
    </>
  );
}

export default NFTMarketAnalytics;
const columns = [
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Item",
    key: "item",

  },
  {
    title: "Collection",
    key: "collection",
  },
  {
    title: "Transaction Status",
    key: "tags",
    dataIndex: "tags",
  },
  {
    title: "Price",
    key: "price",
    dataIndex: "price",
  }
];