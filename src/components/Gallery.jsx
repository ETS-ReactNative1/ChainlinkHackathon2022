import React,{useState,useEffect} from "react";
//import { useSelector } from "react-redux";
import { useRouter } from 'next/router'
import { useMoralis ,useWeb3ExecuteFunction} from "react-moralis";
import axios from 'axios';
import { Table, Tag,Modal } from "antd";
import moment from "moment";
import {
  FileSearchOutlined,
  RightCircleOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useMoralisDapp } from "../providers/MoralisDappProvider/MoralisDappProvider";

/**
 * Container that either shows the views or loading screen
 * @returns
 */

 const styles = {
  flipcard: {
    width: "1600px",
    height: "515px",
    position:"relative",
 },
 flipImg:{
 borderRadius: "10px",
 width: "512px",
 height: "512px"
 }
}

 function Gallery(){
  //const status = useSelector((state) => state.storestate.assetStatus);
  const [loaded, setLoaded] = useState('false')
  const router = useRouter()
  const [CreatedNFTs, setCreatedNFTs] = useState({});
  const [Currentitemid,setitemId]= useState("")
  const [rand, setRand] = useState('blah')
 // var CurrentNFTs={}
  const { Moralis } = useMoralis();
  const contractProcessor = useWeb3ExecuteFunction();

  const [floorvalue, setFloorValue] = useState("")
  const [Currentvalue, setCurentValue] = useState("")
  const [NFTPrice, setPriceofNFT] = useState(0)

  const [lastsale, setLastSale] = useState("")
  const [Avgsale, setAvgSale] = useState("")
  const [fetchMarketItems, setMarketItems] = useState([])
  const purchaseItemFunction = "createMarketSaleRoyalties";
  const [loading, setLoading] = useState(false);
  const { chainId, marketAddress, contractABI, walletAddress,CompanyWallet } =
  useMoralisDapp();
  const contractABIJson = JSON.parse(contractABI);

  let avgPrice = 86.2;
  let lastSale = 18.247;
  
  let priceDisplay = () => {
    if (Currentvalue !="") {
      return Currentvalue ;
    } else {
      return null;
    }
  };
  useEffect(() => {

    if (loaded == 'false') {

        if (router.isReady) {

          const { address,id } = router.query;
          console.log(address)
          console.log(id)

        floor_value(address).then(function (res) {
          ////console.log("RES!:", res)
          if (typeof res !== 'undefined') {
           setFloorValue(res)

          }

      })

      get_current_price(address,id).then(function (res) {
        ////console.log("RES!:", res)
        if (typeof res !== 'undefined') {
          if(res==0) {       
            setCurentValue("NaN")
          }else{
            setCurentValue(convert(res))
            setPriceofNFT(res)

          }

        }

    })
    get_item_id(address,id).then(function (res) {
      ////console.log("RES!:", res)
      if (typeof res !== 'undefined') {
        setitemId(res)

      }

  })

    get_all_sale(address,id).then(function (res) {
      ////console.log("RES!:", res)
      if (typeof res !== 'undefined') {
        setMarketItems(res)

      }

  })


    get_last_sale (address).then(function (res) {
      ////console.log("RES!:", res)
      if (typeof res !== 'undefined') {
        setLastSale(res)

      }

  })

  get_avg_sale(address).then(function (res) {
    ////console.log("RES!:", res)
    if (typeof res !== 'undefined') {
      setAvgSale(res)

    }

})
          check_for_nftinfo(address,id).then(function (res) {
            ////console.log("RES!:", res)
            if (typeof res !== 'undefined') {

            console.log("resscxasda",res)
            setCreatedNFTs( res)
            console.log(CreatedNFTs)
           // CurrentNFTs=res
           // console.log(CurrentNFTs.ImageUrl)
  
            setLoaded('true')
            }
          });
          
      }
    
    } else {
      setRand("rancid")
    }

  });
  async function purchase() {
    setLoading(true);

    const ops = {
        contractAddress: marketAddress,
        functionName: purchaseItemFunction,
        abi: contractABIJson,
        params: {
            // nftContract: nftToBuy.collection.attributes.NFTsol_addr,
            // itemId: itemID,

            nftContract: CreatedNFTs.realaddress,
            itemId: Currentitemid,
            OriginalMinter:CreatedNFTs.minted_wallet,
            //""
            CompanyWallet:CompanyWallet,
        },
        // msgValue: tokenPrice,
        msgValue: String(NFTPrice),
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
            updateSoldMarketItem(CreatedNFTs.id);
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
  async function check_for_nftinfo(nftaddress,nftid) {
    //console.log("check!!")
    //console.log("Fetching profile image!")
    const NFTMetadata = Moralis.Object.extend("NFTMetadata");
    const query = new Moralis.Query(NFTMetadata);
    //console.log("current user:", currentUser)
    query.equalTo("NFTsol_addr_lowercase",nftaddress)

    //query.equalTo("objectId",currentUser.objectId)
    //const results = await query.find();
    //var img_url = ""
    var rest={}
    const res = await query.find();
        console.log("RES:", res)
        console.log("hi")
        //console.log("")
        //console.log("res:", res)
            var object = res[0];
            console.log(object.attributes.Collection.attributes.image)
            rest = {
              id: object.id,
              collection_name: object.attributes.Collection.attributes.collection_name,
              minted_wallet:object.attributes.Collection.attributes.Minted_wallet,
              price: object.attributes.list_price,
              URI:object.attributes.URI,
              token_id:nftid,
              address:nftaddress,
              realaddress:object.attributes.NFTsol_addr
            }
          console.log(rest)
        
        //return rests
    var meta = await axios.get(object.attributes.URI)
    console.log("meta",meta)

    rest.ImageUrl=meta.data.image
    rest.description=meta.data.description
    rest.title=meta.data.name
    return rest

    //return ""
}
async function floor_value(nftaddress) {
  //console.log("check!!")
  //console.log("Fetching profile image!")
  const MumbaiNFTMarketplaceTable = Moralis.Object.extend("MumbaiNFTMarketplaceTable");
  const query = new Moralis.Query(MumbaiNFTMarketplaceTable);
  query.equalTo("nftContract",nftaddress)
  query.equalTo("sold", false)
  query.descending("price");
  query.select("price");
  //console.log("current user:", currentUser)
  console.log("address",nftaddress)
  //query.equalTo("objectId",currentUser.objectId)
  //const results = await query.find();
  //var img_url = ""
  var minimumval=""

  await query.first().then((res) => {
      console.log("RES floor:", res)
      console.log("hi")
      //console.log("")
      //console.log("res:", res)
        minimumval=convert(res.attributes.price)
        console.log(minimumval)
      }, (error) => {
      //console.log("error!")
      // The object was not retrieved successfully.
      // error is a Moralis.Error with an error code and message.
  });
  return minimumval
}
async function get_all_sale(nftaddress,nftid) {
  //console.log("check!!")
  //console.log("Fetching profile image!")
  var nft_metadata = []


  const MumbaiNFTMarketplaceTable = Moralis.Object.extend("MumbaiNFTMarketplaceTable");
  const query = new Moralis.Query(MumbaiNFTMarketplaceTable);
  query.equalTo("nftContract",nftaddress)
  query.equalTo("tokenId", String(nftid))
  query.equalTo("sold", true)
  query.ascending("updatedAt");
  query.select("price","seller","owner","updatedAt");
  //console.log("current user:", currentUser)
  console.log("address",nftaddress)
  //query.equalTo("objectId",currentUser.objectId)
  //const results = await query.find();
  //var img_url = ""
  await query.find().then((results) => {
    if (typeof results !== 'undefined') {
      for (let i = 0; i < results.length; i++) {
          ////console.log("i:",i)
          var object = results[i];
          var item = {
            price:convert(object.attributes.price),
            seller:object.attributes.seller,
            owner:object.attributes.owner,
            updatedAt:object.attributes.updatedAt
          }
        //console.log(Object.keys(nft_metadata))
        console.log("item:",item)
        nft_metadata.push(item)
        //console.log(nft_metadata)
          
      }
  }
});

const CollectionsTracker = Moralis.Object.extend("CollectionsTracker");
const collectquery = new Moralis.Query(CollectionsTracker);
collectquery.equalTo("NFTsol_addr_lowercase",nftaddress)
await collectquery.find().then((results) => {
  if (typeof results !== 'undefined') {
    for (let i = 0; i < results.length; i++) {
        ////console.log("i:",i)
        var object = results[i];
        var item = {
          price:"NA",
          seller:"Null",
          owner:object.attributes.Minted_wallet,
          updatedAt:"createdAt"
        }
      //console.log(Object.keys(nft_metadata))
      console.log("item:",item)
      nft_metadata.push(item)
      //console.log(nft_metadata)
        
    }
}
});

  return nft_metadata
}


async function get_last_sale(nftaddress) {
  //console.log("check!!")
  //console.log("Fetching profile image!")
  const MumbaiNFTMarketplaceTable = Moralis.Object.extend("MumbaiNFTMarketplaceTable");
  const query = new Moralis.Query(MumbaiNFTMarketplaceTable);
  query.equalTo("nftContract",nftaddress)
  query.equalTo("sold", true)
  query.ascending("updatedAt");
  query.select("price");
  //console.log("current user:", currentUser)
  console.log("address",nftaddress)
  //query.equalTo("objectId",currentUser.objectId)
  //const results = await query.find();
  //var img_url = ""
  var minimumval=""

  await query.first().then((res) => {
      console.log("RES floor:", res)
      console.log("hi")
      //console.log("")
      //console.log("res:", res)

      if(typeof res !== 'undefined'){
        minimumval=convert(res.attributes.price)
        console.log("LAST SALE",minimumval)
      }else{
        minimumval="NaN"
      }
    

      }, (error) => {
      //console.log("error!")
      // The object was not retrieved successfully.
      // error is a Moralis.Error with an error code and message.
  });
  return minimumval
}

async function get_item_id(nftaddress,token_id) {
    //console.log("check!!")
    //console.log("Fetching profile image!")
    const MumbaiNFTMarketplaceTable = Moralis.Object.extend("MumbaiNFTMarketplaceTable");
    const query = new Moralis.Query(MumbaiNFTMarketplaceTable);
    query.equalTo("nftContract",nftaddress)
    query.equalTo("tokenId", String(token_id))
    query.ascending("updatedAt");
    query.select("itemId","sold");
    //console.log("current user:", currentUser)
    console.log("address",nftaddress)
    //query.equalTo("objectId",currentUser.objectId)
    //const results = await query.find();
    //var img_url = ""
    var myitemId="";
  
    await query.first().then((res) => {
        console.log("RES floor:", res)
        console.log("hi")
        //console.log("")
        //console.log("res:", res)
        if(!( res.attributes.sold)){
          myitemId=res.attributes.itemId
          console.log(myitemId)
        }else{
          myitemId=""
        }
        }, (error) => {
        //console.log("error!")
        // The object was not retrieved successfully.
        // error is a Moralis.Error with an error code and message.
    });
    return myitemId
  }

async function get_avg_sale(nftaddress) {
  //console.log("check!!")
  //console.log("Fetching profile image!")
  const MumbaiNFTMarketplaceTable = Moralis.Object.extend("MumbaiNFTMarketplaceTable");
  const query = new Moralis.Query(MumbaiNFTMarketplaceTable);
  query.equalTo("nftContract",nftaddress)
  query.equalTo("sold", true)
  query.select("price");
  //console.log("current user:", currentUser)
  console.log("address",nftaddress)
  //query.equalTo("objectId",currentUser.objectId)
  //const results = await query.find();
  //var img_url = ""
  const results = await query.find();
  if(typeof results !== 'undefined'){
  let sum = 0;
  for (let i = 0; i < results.length; ++i) {
    sum += parseInt(results[i].get("price"));
  }
  console.log("sum",sum)
  console.log("length:",results.length)
  console.log(sum/results.length)
  return convert(sum/results.length);}
  else{
    return "N/A"
  }
}

async function get_current_price(nftaddress,token_id) {
  //console.log("check!!")
  //console.log("Fetching profile image!")
  const MumbaiNFTMarketplaceTable = Moralis.Object.extend("MumbaiNFTMarketplaceTable");
  const query = new Moralis.Query(MumbaiNFTMarketplaceTable);
  query.equalTo("nftContract",nftaddress)
  query.equalTo("tokenId", String(token_id))
  query.ascending("updatedAt");
  query.select("price","sold");
  //console.log("current user:", currentUser)
  console.log("address",nftaddress)
  //query.equalTo("objectId",currentUser.objectId)
  //const results = await query.find();
  //var img_url = ""
  var minimumval=0

  await query.first().then((res) => {
      console.log("RES floor:", res)
      console.log("hi")
      //console.log("")
      //console.log("res:", res)
      if(!( res.attributes.sold)){
        minimumval=res.attributes.price
        console.log(minimumval)
      }else{
        minimumval=0
      }
      }, (error) => {
      //console.log("error!")
      // The object was not retrieved successfully.
      // error is a Moralis.Error with an error code and message.
  });
  return minimumval
}

function convert(input_price) {
  return String(parseInt(input_price) / 1e18)
}
function Sellerlogic (text) {
  if (text === "Null") {
    return <a href="https://mumbai.polygonscan.com/address/0x0000000000000000000000000000000000000000"> {text}</a>
  }else{
    return  <a href={"https://mumbai.polygonscan.com/address/"+text}> {text.substring(0, 8)}</a>
  }
};


const columns = [
  {
    title: "Action",
    dataIndex: 'action',
    key: "action",
    //render: (text, row, index) =>    <a href={"https://mumbai.polygonscan.com/tx/"+text.substring(4, length(text))}> {text.substring(0, 4)}</a>,
    //0x1256982a14fddfd1823292d4d71a746fb69f35929adcd116633efc0e6dcf5d6f
  },

  {
    title: "Price",
    dataIndex: 'price',
    key: "price",
  },

  {
    title: "Buyer",
    dataIndex: 'owner',
    key: "owner",
    render: (text, row, index) =>    <a href={"https://mumbai.polygonscan.com/address/"+text}> {text.substring(0, 8)}</a>,
  },

  {
    title: "Seller",
    dataIndex: "seller",
    key: "seller",
    render: (text, row, index) =>    Sellerlogic(text),

  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
  },
];
function keyprint(len,index,date,price,seller,owner){
  if (index ==len-1) {
    return {
      key: index,
      date: moment(date).format("DD-MM-YYYY HH:mm"),
      price:price,
      seller:seller,
      owner:owner,
      action:"Mint"
      //{"Mint"+"0x1256982a14fddfd1823292d4d71a746fb69f35929adcd116633efc0e6dcf5d6f"}
    };
  } else {
    return {
      key: index,
      date: moment(date).format("DD-MM-YYYY HH:mm"),
      price:price,
      seller:seller,
      owner:owner,
      action:"Sale"
      //{"Sale"+"0x1256982a14fddfd1823292d4d71a746fb69f35929adcd116633efc0e6dcf5d6f"}

    };
  }
};
const data = fetchMarketItems?.map((item, index) => (keyprint(fetchMarketItems.length,index,item.updatedA,item.price,item.seller,item.owner)));

    return (
      <div className="flex   w-full">
       <div>
            <div style={styles.flipcard}>
      <div className="ml-20 absolute left-24 ">
        <img 
        src={CreatedNFTs?.ImageUrl|| "error"} 
        style={styles.flipImg}/>
      </div>

      <div className="absolute right-24 flex flex-col justify-between" style={{ marginLeft: "800px",width:"800px" }}>
      <p className="collectionName">{CreatedNFTs.collectionSlug}</p>
      <div className="-mt-5 flex items-center">
        <span className="table-cell align-middle leading-loose text-4xl mr-4">#{CreatedNFTs.token_id}</span>
 
      </div>

  
        <div className="flex items-center">
          <div className="table-cell align-middle leading-loose  text-3xl w-full" >Buy Now: {priceDisplay() ? Currentvalue : "Not For Sale"} {priceDisplay() && <ShoppingCartOutlined onClick={() => purchase()} />} </div>
          <span className="flex justify-center w-full"></span>
        </div>
    
        <div className="flex justify-between mt-2.5 border-solid border-l-2 border-r-2 border-t-2 border-black rounded p-2 text-center">
        <div className="text-2xl text-center">
          <span>Collection Statisitcs</span>
          </div>
</div>

      <div className="flex justify-between  border-solid border-2 border-black rounded p-2 text-center">
        <div className="text-2xl">
          <span>Floor Price</span>
          <br />
          <span>{floorvalue}</span>
        </div>
        <div className="text-2xl">
          <span>Average Price</span>
          <br />
          <span>{Avgsale}</span>
        </div>
        <div className="text-2xl">
          <span>Last Sale</span>
          <br />
          <span>{lastsale}</span>
        </div>
      </div>
      <Table title={() => "Past Transactions"}   pagination={{ position: ["bottomCenter", "bottomCenter"] }}  bordered columns={columns} dataSource={data} />
    </div>
    </div>
      </div>
      </div>

    );
};

export default Gallery;
