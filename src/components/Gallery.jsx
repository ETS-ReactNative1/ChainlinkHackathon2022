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



import Logo from "./Logo";
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
 },
 smallerImg:{
  borderRadius: "10px",
  width: "200px",
  height: "200px"
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
  const [description, setdescription] = useState("")
const DMurl="data:image/png;base64,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"
const GSWurl="https://upload.wikimedia.org/wikipedia/en/thumb/0/01/Golden_State_Warriors_logo.svg/1200px-Golden_State_Warriors_logo.svg.png"
  const MHurl="https://upload.wikimedia.org/wikipedia/en/thumb/f/fb/Miami_Heat_logo.svg/1200px-Miami_Heat_logo.svg.png"
  const BCurl="https://upload.wikimedia.org/wikipedia/en/thumb/8/8f/Boston_Celtics.svg/1200px-Boston_Celtics.svg.png"
  const [Avgsale, setAvgSale] = useState("")
  const [fetchMarketItems, setMarketItems] = useState([])
  const [Team1, setTeam1] = useState(DMurl)
  const [Team2, setTeam2] = useState(GSWurl)

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
  function DateDisplay () {
    console.log()
    if (description !="") {
      return description.split(",")[0]  ;
    } else {
      return null;
    }
  };
  let Team1Display = () => {
    if (description !="") {

      return description.split(",")[1]  ;
    } else {
      return null;
    }
  };
    let Team1DisplayURL = () => {
    if (description !="") {
      if(description.split(",")[1].includes("allas")){
        return (DMurl)
      }else if(description.split(",")[1].includes("arriors")){
        return (GSWurl)
      }else if(description.split(",")[1].includes("eat")){
        return (MHurl)
      }else if(description.split(",")[1].includes("eltic")){
        return (BCurl)
      }
    } else {
      return null;
    }
  };
  let Team2DisplayURL = () => {
    if (description !="") {
      if(description.split(",")[2].includes("allas")){
        return (DMurl)
      }else if(description.split(",")[2].includes("arriors")){
        return (GSWurl)
      }else if(description.split(",")[2].includes("eat")){
        return (MHurl)
      }else if(description.split(",")[2].includes("eltic")){
        return (BCurl)
      }
    } else {
      return null;
    }
  };
  let Team2Display = () => {
    if (description !="") {
      return description.split(",")[2]  ;
    } else {
      return null;
    }
  };
  let OddsDisplay = () => {
    if (description !="") {
      return description.split(",")[3]+","+ description.split(",")[4] ;
    } else {
      return null;
    }
  };
  let  BetDisplay= () => {
    if (description !="") {
      return description.split(",")[5]  ;
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
            setdescription(res.description)
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
              <div className="-mt-5 flex items-center">
      <span className="table-cell align-middle leading-loose text-4xl mr-4">Description:</span>
</div>
<div className="-mt-5 flex items-center">

<span className="table-cell align-middle leading-loose text-2xl mr-4">  {DateDisplay() ? DateDisplay() :""}</span>
</div>
<div className="-mt-5 flex items-center">

<span className="table-cell align-middle leading-loose text-2xl mr-4">  {Team1Display() ? Team1Display() :""}</span>

</div>

<div className="-mt-5 flex items-center">

<span className="table-cell align-middle leading-loose text-2xl mr-4">  {Team2Display() ? Team2Display() :""}</span>
</div>
<div className="-mt-5 flex items-center">

<span className="table-cell align-middle leading-loose text-2xl mr-4">  {OddsDisplay() ? OddsDisplay() :""}</span>
</div>
<div className="-mt-5 flex items-center">

<span className="table-cell align-middle leading-loose text-2xl mr-4">  {BetDisplay() ? BetDisplay() :""}</span>
</div>

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
      <div className="ml-20  left-24 grid grid-cols-2 ">
        <div>
     <img 
        src={Team1DisplayURL() ? Team1DisplayURL() :"error"}
        style={styles.smallerImg}/>    
        </div>
        <div>

           <img 
        src={Team2DisplayURL() ? Team2DisplayURL() :"error"}
        style={styles.smallerImg}/>   
   
</div>

</div>
    </div>

    </div>
      </div>
      </div>

    );
};

export default Gallery;
