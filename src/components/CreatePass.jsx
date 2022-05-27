import React, { useRef,useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import { Select,Icon } from 'antd';
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import Router from "next/router";
import Web3Modal from "web3modal"
import { ethers} from 'ethers'
import { ConsoleSqlOutlined } from "@ant-design/icons";




function CreatePass() {

  const [fileUrl, setFileUrl] = useState(null)
  const [ImageUrl, setImageUrl] = useState(null)
  const [ImageUrl2, setImageUrl2] = useState(null)

  const [BrandArtFileUrl, setBrandArtFileUrl] = useState(null)
  const [CouponFileUrl, setCouponFileUrl] = useState(null)


  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '', CollectionName: '', TokenName: '' })
  const [teamsinfo, updateteamsinfo] = useState(0)

  const [inputValue, setInputValue] = useState("");
  const { Option } = Select;
  const { chainId } = useMoralisDapp();
  const { Moralis} = useMoralis();
  const nftabi=[
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "id",
          "type": "bytes32"
        }
      ],
      "name": "ChainlinkCancelled",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "id",
          "type": "bytes32"
        }
      ],
      "name": "ChainlinkFulfilled",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "id",
          "type": "bytes32"
        }
      ],
      "name": "ChainlinkRequested",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_price",
          "type": "uint256"
        }
      ],
      "name": "below20",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_price",
          "type": "uint256"
        }
      ],
      "name": "below30",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_price",
          "type": "uint256"
        }
      ],
      "name": "below40",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_price",
          "type": "uint256"
        }
      ],
      "name": "below50",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "Price",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_requestId",
          "type": "bytes32"
        },
        {
          "internalType": "uint256",
          "name": "_price",
          "type": "uint256"
        }
      ],
      "name": "fulfill",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "getURL",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "path",
          "type": "string"
        }
      ],
      "name": "requestBTCCNYPrice",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "requestId",
          "type": "bytes32"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "returnodds",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "odds",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]

  const [loadedCollections, setLoadedCollections] = useState('false');
  //var NFTCollections = getCollectionsByChain(chainId);
  const [NFTCollections, setNFTCollections] = useState([])
  const [TeamGames, setTeamGames] = useState([])
  const [TeamDateGames, setTeamDateGames] = useState([])
  const [Team1, setTeam1] = useState([])

  const [Team2, setTeam2] = useState([])
  const [ChoosenTeam1, setchoosenTeam1] = useState("")
  const [ChoosenTeam2, setchoosenTeam2] = useState("")
  const [chosenDate, setchosenDate] = useState("")
  const [BetAmount, setBetAmount] = useState("")
  const [Underbool, setunder] = useState(false)

  
  

  const [url, seturl] = useState("https://api.the-odds-api.com/v4/sports/basketball_nba/odds/?regions=us&oddsFormat=american&apiKey=a218e281dc52ddab7c880948776e7c0f")
  const [urlpath, setPath] = useState("0.bookmakers.1.markets.0.outcomes.1.0")

  const [rand, setRand] = useState('rand!')
let odds="rand"
  //const router = useRouter();
  const ipfsAPI = require('ipfs-api')
  const ipfs = ipfsAPI('ipfs.infura.io', '5001', { protocol: 'https' })
const [newloc, setnewloc] = useState("");
const [placeholdertext, setplaceholdertext] = useState("NA");
const [placeholdertext2, setplaceholdertext2] = useState("NA");

//var buffer=[]
  const canvas = useRef();
  let ctx = null;

  useEffect(() => {
    // dynamically assign the width and height to canvas

    const canvasEle = canvas.current;

   // canvasEle.width = canvasEle.clientWidth;
    canvasEle.height = canvasEle.clientHeight;
    canvasEle.width =400

   //canvasEle.height = 200
    // get context of the canvas
    ctx = canvasEle.getContext("2d");
  }, []);
 
  useEffect(() => {

    var arr = []
    var coll = {
      date:"5/26/2022",
      team1:"Golden State Warriors",
      team2: "Dallas Mavericks",
    }
    arr.push(coll)
    coll = {
      team1:"Miami Heat",
      date:"5/27/2022",
      team2: "Boston Celtics",
    }
    arr.push(coll)
    coll = {
      team1:"Miami Heat",
      date:"5/29/2022",
      team2: "Boston Celtics",
    }
    arr.push(coll)
    setTeamGames(arr)
    writeText({ text: 'Bet Amount : ', x: 10, y: 5, colors: "green"});
    writeText({ text: 'Date : ', x: 10, y: 30, colors: "green"});
    writeText({ text: 'Team 1 : ', x: 10, y: 55, colors: "green"});
    writeText({ text: 'Team 2 : ', x: 10, y: 80, colors: "green" });
    writeText({ text: "NA", x: 10,y: 105, colors: "green"});
    const canvasEle = canvas.current;

   }, []);
 
  // write a text
  const writeText = (info, style = {}) => {
    const { text, x, y,colors } = info;
    const { fontSize = 20, fontFamily = 'Arial', color = colors , textAlign = 'left', textBaseline = 'top' } = style;
 
    ctx.beginPath();
    ctx.font = fontSize + 'px ' + fontFamily;
    ctx.textAlign = textAlign;
    ctx.textBaseline = textBaseline;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
    ctx.stroke();
  
  }

  useEffect(() => {

    if (loadedCollections === 'false') {

      try {
        //console.log("HERE IN COLLECTIONS!!!!!")
        const CollectionsTracker = Moralis.Object.extend("CollectionsTracker");
        const query = new Moralis.Query(CollectionsTracker);
        const currentUser = Moralis.User.current();
        //console.log("Current User:!", currentUser)
        query.equalTo("CurrUser", currentUser);
        query_collections(query).then(function (res) {
          setNFTCollections(res)
          setLoadedCollections('true')
        });
      }

      catch (e) {
        console.log("e:", e)
      }
    }
    else {

    }


  });


  async function query_collections(query) {
    var arr = []
    try {
      await query.find().then(function (results) {
        //console.log("results:", results)
        for (var i = 0; i < results.length; i++) {
          var coll = {
            image:
              "https://lh3.googleusercontent.com/BWCni9INm--eqCK800BbRkL10zGyflxfPwTHt4XphMSWG3XZvPx1JyGdfU9vSor8K046DJg-Q8Y4ioUlWHiCZqgR_L00w4vcbA-w=s0",
            name: results[i].get('collection_name'),
            addrs: results[i].get('NFTsol_addr'),
          }
          arr.push(coll)
        }
        //console.log("nft collections arr:", arr)
        return arr;
      })
        .catch(function (error) {
          // There was an error.
          return []
        });
    }
    catch (e) {
      console.log("nasty error:", e)
      setRand('repeat!')
    }

    return arr
  }


  async function onChange(e) {
   // const file = e.target.files[0]
    //const fileInput = document.getElementById("file");
    //const data = fileInput.files[0];
  //  const imageFile = new Moralis.File(file.name, file);
   // await imageFile.saveIPFS();
  //  const imageURI = imageFile.ipfs();
   // console.log("imageURI btw:", imageURI)

  }



  function validate_form_server_side() {
    //
    //console.log("fileUrl:", fileUrl)
    if (formInput.name.length == 0 ) {
      alert("Please fill out name!")
      //Do nothing --> client warns them to fill it out!
    }

    else {
      upload()
    }
  }

  async function upload() {
    console.log(newloc)
    var imageURI="";
    var metadataURI = "";
    if(Underbool){
    var currentdesctiption="Date:"+chosenDate+",Team1:"+ChoosenTeam1+",Team2:"+ChoosenTeam2+",Odds:"+placeholdertext+",Under:"+placeholdertext2+",Bet Amount:"+BetAmount
    }else{
      var currentdesctiption="Date:"+chosenDate+",Team1:"+ChoosenTeam1+",Team2:"+ChoosenTeam2+",Odds:"+placeholdertext+",Over:"+placeholdertext2+",Bet Amount:"+BetAmount

    }
    //alert("image uri:",imageURI)
    let metadata = {
      "name": formInput.name,
      "description":"",
      "image":"",
    }
    if(newloc.search("http")==-1){
    //const imageFile = new Moralis.File(fileUrl.name, fileUrl);
    const buffer = Buffer(newloc.split(",")[1], 'base64');

const INFURA_HTTPS = "https://ipfs.infura.io/ipfs/";

 // let canvas = canvasRef.current.canvasContainer.children[1];
  //let dataUrl = canvas.toDataURL("image/png");
  //const buffer = Buffer(dataUrl.split(",")[1], 'base64');
  console.log(buffer)
 
  const result=await ipfs.files.add(buffer)

  metadata.image = INFURA_HTTPS + result[0].hash;
  console.log(metadata)

  

  }
  else{
    metadata.image= newloc;

  }
  console.log(metadata)
  metadata.description=currentdesctiption
  const metadataFile = new Moralis.File("metadata.json", { base64: btoa(JSON.stringify(metadata)) });
  await metadataFile.saveIPFS();
  metadataURI = metadataFile.ipfs();

console.log(metadata)
    console.log("metadatauri btw:", metadataURI)


    const currentUser = Moralis.User.current();

    if (formInput.CollectionName === '') {
      console.log("EMPTY COLLECTION NAME!!!", formInput.CollectionName)
      const CollectionsTracker = Moralis.Object.extend("CollectionsTracker");
      const query = new Moralis.Query(CollectionsTracker);
      const currentUser = Moralis.User.current();
      query.equalTo("collection_name", "General Collection");
      query.find().then(function (res) {
        if (res.length === 0) {
          //If new collection name is input and is not found previously in moralis db: 
          //1. Create new collection
          var token_name = "CouponMint";
          const coll = new CollectionsTracker();
          coll.set("collection_name", "General Collection");
          coll.set("token_name", token_name);
          coll.set("image", imageURI);
          coll.set("chain_id", chainId);
          coll.set("CurrUser", currentUser);
          coll.save();
          alert("successfully saved collection!")
          //2. Add metadata into moralis db
          console.log("currentUser", currentUser)
          const Metadata = Moralis.Object.extend("NFTMetadata");
          const meta = new Metadata();
          meta.set("URI", metadataURI);
          meta.set("CurrUser", currentUser);
          meta.set("orig_creator", currentUser.get("ethAddress"));
          meta.set("Collection", coll);
          meta.set("minted", "false");
          meta.save();

        } else {

          console.log("res:", res)

          const Metadata = Moralis.Object.extend("NFTMetadata");
          const meta = new Metadata();
          meta.set("URI", metadataURI);
          meta.set("CurrUser", currentUser);
          meta.set("orig_creator", currentUser.get("ethAddress"));

          meta.set("Collection", res[0]);
          
          meta.set("minted", "false");
          meta.save();
          //alert("Successfully saved NFT as part of General Collection")
          Router.push('Profile');

          ////Do nothing --> Just alert the user that they need a unique collection name 
          //alert("Collection with this name already exists! Please choose another collection name!")
        }
      });



    } else {
      console.log("NOT EMPTY COLLECTION NAME!!!", formInput)
      const CollectionsTracker = Moralis.Object.extend("CollectionsTracker");
      const query = new Moralis.Query(CollectionsTracker);
      const currentUser = Moralis.User.current();
      query.equalTo("collection_name", formInput.CollectionName);
      query.find().then(function (res) {
        console.log("res:", res)
        console.log("currentUser", currentUser)
        const Metadata = Moralis.Object.extend("NFTMetadata");
        const meta = new Metadata();
        meta.set("URI", metadataURI);
        meta.set("CurrUser", currentUser);
        meta.set("orig_creator", currentUser.get("ethAddress"));
        console.log("hi")
        meta.set("Collection", res[0]);
        meta.set("minted", "false");
        meta.save();
        //alert("Successfully saved NFT to collection!", res[0])
        console.log("hi2")
        Router.push('Profile');

      }).catch(function (error) {
        console.log("error!")
      })
    }

  }
  async function pullodds() {
    if (Team2 == "" || Team1 =="") {
      alert("please choose your teams to pull odds!")

    }

    else {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)    
    const signer = provider.getSigner()
    let contract = new ethers.Contract("0x2487f33f0db701f3b2610cc9d93366beC6505795", nftabi, signer)
    var localpath=""
    if(ChoosenTeam1== "Golden State Warriors"){
localpath="0.bookmakers.1.markets.0.outcomes.0.price"
    }
else{
  localpath="1.bookmakers.1.markets.0.outcomes.1.price"

}    
var localurl="https://api.the-odds-api.com/v4/sports/basketball_nba/odds/?regions=us&oddsFormat=american&apiKey=a218e281dc52ddab7c880948776e7c0f"
    let transaction = await contract.requestBTCCNYPrice(localurl,localpath)
    let tx = await transaction.wait()
    const contract2 = new ethers.Contract("0x2487f33f0db701f3b2610cc9d93366beC6505795", nftabi, provider);
    var response =  (await contract2.Price()).toNumber()
    var testresponse=(await contract2.Price()).toNumber()
    var localcount=0

    console.log(response)
    console.log(typeof(response))

    while (response-testresponse==0 && localcount<30) {
      sleepFor(1000)
      response = (await contract2.Price()).toNumber()
      console.log(response)
      localcount=localcount+1

    }

    odds="Odds: +"+response.toString()
    const canvasEle = canvas.current;


    // canvasEle.height = 400
     // get context of the canvas
     ctx = canvasEle.getContext("2d");

    writeText({ text: placeholdertext, x: 10,y: 105, colors: "white"});

    writeText({ text: odds, x: 10,y: 105, colors: "green"});
    
    setplaceholdertext(odds)
    setnewloc(canvasEle.toDataURL( "image/png"));
    setImageUrl(newloc)
    console.log(newloc)
    setFileUrl(newloc)
  }
}
  async function pullPointsover() {
    if (Team2 == "" || Team1 =="") {
      alert("please choose your teams to pull points!")

    }

    else {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)    
    const signer = provider.getSigner()
    let contract = new ethers.Contract("0x2487f33f0db701f3b2610cc9d93366beC6505795", nftabi, signer)
    var localpath=""

    if(ChoosenTeam1== "Golden State Warriors"){
      localpath="0.bookmakers.17.markets.0.outcomes.1.point"
          }
      else{
        localpath="1.bookmakers.17.markets.0.outcomes.1.point"
      
      }    
      var localurl="https://api.the-odds-api.com/v4/sports/basketball_nba/odds/?regions=us&oddsFormat=american&apiKey=a218e281dc52ddab7c880948776e7c0f&markets=totals"
    let transaction = await contract.requestBTCCNYPrice(localurl,localpath)
    
    let tx = await transaction.wait()
    const contract2 = new ethers.Contract("0x2487f33f0db701f3b2610cc9d93366beC6505795", nftabi, provider);
    var response =  (await contract2.Price()).toNumber()
    var testresponse=(await contract2.Price()).toNumber()
    var localcount=0
    console.log(response)
    console.log(typeof(response))
    while (response-testresponse==0 && localcount<30) {
      sleepFor(1000)
      response = (await contract2.Price()).toNumber()
      console.log(response)
      localcount=localcount+1
    }
    odds="Score Over: +"+(response+0.5).toString()
    const canvasEle = canvas.current;


    // canvasEle.height = 400
     // get context of the canvas
     ctx = canvasEle.getContext("2d");

    writeText({ text: placeholdertext2, x: 10, y: 130, colors: "white"});

    writeText({ text: odds, x: 10, y: 130, colors: "green"});
    
    setplaceholdertext2(odds)
    setunder(false)

    setnewloc(canvasEle.toDataURL( "image/png"));
    setImageUrl(newloc)
    console.log(newloc)
    setFileUrl(newloc)
  }
}
  async function pullPointsunder() {
    if (Team2 == "" || Team1 =="") {
      alert("please choose your teams to pull points!")
    }

    else {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)    
    const signer = provider.getSigner()
    let contract = new ethers.Contract("0x2487f33f0db701f3b2610cc9d93366beC6505795", nftabi, signer)
    var localpath=""

    if(ChoosenTeam1== "Golden State Warriors"){
      localpath="0.bookmakers.17.markets.0.outcomes.1.point"
          }
      else{
        localpath="1.bookmakers.17.markets.0.outcomes.1.point"
      
      }    
      var localurl="https://api.the-odds-api.com/v4/sports/basketball_nba/odds/?regions=us&oddsFormat=american&apiKey=a218e281dc52ddab7c880948776e7c0f&markets=totals"
   
 
    let transaction = await contract.requestBTCCNYPrice(localurl,localpath)
    let tx = await transaction.wait()
    const contract2 = new ethers.Contract("0x2487f33f0db701f3b2610cc9d93366beC6505795", nftabi, provider);
    var response =  (await contract2.Price()).toNumber()
    var testresponse=(await contract2.Price()).toNumber()
    var localcount=0
    console.log(response)
    console.log(typeof(response))
    while (response-testresponse==0 && localcount<30) {
      sleepFor(1000)
      response = (await contract2.Price()).toNumber()
      console.log(response)
      localcount=localcount+1
    }
    odds="Score Under: "+(response+0.5).toString()
    const canvasEle = canvas.current;


    // canvasEle.height = 400
     // get context of the canvas
     ctx = canvasEle.getContext("2d");

    writeText({ text: placeholdertext2, x: 10,  y: 130, colors: "white"});

    writeText({ text: odds, x: 10,  y: 130, colors: "green"});
    
    setplaceholdertext2(odds)
    setunder(true)
    setnewloc(canvasEle.toDataURL( "image/png"));
    setImageUrl(newloc)
    console.log(newloc)
    setFileUrl(newloc)
  }
}
  async function sendlink() {


    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)    
    const signer = provider.getSigner()
    const linktokenAddress = "0x326C977E6efc84E512bB9C30f76E30c160eD06FB";
    const linktokenAbi = [
      // Some details about the token
      "function transfer(address _to, uint _value)"

    ];
    const linktokenContract = new ethers.Contract(linktokenAddress, linktokenAbi, provider);
    const onelinktoken = ethers.utils.parseUnits("1.0", 18);
    const linkSigner = linktokenContract.connect(signer);
    var testit=await linkSigner.transfer("0x2487f33f0db701f3b2610cc9d93366beC6505795",onelinktoken)

  }

  async function choose_collection1(e) {
    var team1vec=[]
    var team2vec=[]
    for (var i = 0; i < TeamGames.length; i++) {
      //          setTeam1(TeamGames[i].team1)
     // setTeam2(TeamGames[i].team1)
     console.log(TeamGames[i].date)
        if(TeamGames[i].date==e){
              team1vec.push(TeamGames[i].team1)
              team2vec.push(TeamGames[i].team2)
        }

    }
    setTeam1(team1vec)
    setTeam2(team2vec)
    setchosenDate(e)
    const canvasEle = canvas.current;


    // canvasEle.height = 400
     // get context of the canvas
     ctx = canvasEle.getContext("2d");
     writeText({ text: chosenDate, x: 100, y: 30, colors: "white"});

     writeText({ text: e, x: 70, y: 30, colors: "green"});

    
    setnewloc(canvasEle.toDataURL( "image/png"));
    setImageUrl(newloc)
    console.log(newloc)
    setFileUrl(newloc)
    console.log(e)
    console.log(team1vec)
    console.log(team2vec)


  }

  async function choose_team1(e) {

    const canvasEle = canvas.current;


    // canvasEle.height = 400
     // get context of the canvas
     ctx = canvasEle.getContext("2d");
     writeText({ text: ChoosenTeam1, x: 100, y: 55, colors: "white"});

     writeText({ text: e, x: 100, y: 55, colors: "green"});

    
    setnewloc(canvasEle.toDataURL( "image/png"));
    setImageUrl(newloc)
    console.log(newloc)
    setFileUrl(newloc)

    setchoosenTeam1(e)



  }

  async function choose_team2(e) {

    const canvasEle = canvas.current;


    // canvasEle.height = 400
     // get context of the canvas
     ctx = canvasEle.getContext("2d");
     writeText({ text: ChoosenTeam2, x: 100, y: 80, colors: "white"});

     writeText({ text: e, x: 100, y: 80, colors: "green"});

    
    setnewloc(canvasEle.toDataURL( "image/png"));
    setImageUrl(newloc)
    console.log(newloc)
    setFileUrl(newloc)

    setchoosenTeam2(e)



  }
  async function chooseamount(e) {

    const canvasEle = canvas.current;


    // canvasEle.height = 400
     // get context of the canvas
     ctx = canvasEle.getContext("2d");
     writeText({ text: ChoosenTeam2, x: 130, y: 5, colors: "white"});

     writeText({ text: e, x: 130, y: 5, colors: "green"});

    
    setnewloc(canvasEle.toDataURL( "image/png"));
    setImageUrl(newloc)
    console.log(newloc)
    setFileUrl(newloc)

    setBetAmount(e)



  }
  function sleepFor(sleepDuration){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ 
        /* Do nothing */ 
    }
    }


    async function onChangeCouponImage(e) {
      const file = e.target.files[0]
      //const fileInput = document.getElementById("file");
      //const data = fileInput.files[0];
      const imageFile = new Moralis.File(file.name, file);
      await imageFile.saveIPFS();
      const imageURI = imageFile.ipfs();
      console.log("imageURI btw:", imageURI)
      setImageUrl(imageURI)
      setFileUrl(file)
      setnewloc(imageURI)
    }


  return (
    <>
      <div className="container">
        <div className="div">
          <h1 className="text-4xl font-bold mt-0 mb-2 ">Create an NFT</h1>
        </div>


        <form>
          <div className="form-group">

            <div className="mb-6 pt-5">
              <label htmlFor="username-success" className="block mb-2 text-sm font-medium">Your NFT name</label>
              <input type="text" id="username-success" className=" border  text-sm rounded-lg  block w-full p-2.5 dark:bg-green-100 dark:border-green-400" placeholder="Ex: My new fav bet"
                onChange={e => updateFormInput({ ...formInput, name: e.target.value })} required />

            </div>

            <div className="input-group mb-3 pt-3">
              <label htmlFor="username-success" className="block mb-2 text-sm font-medium">Collection</label>
              <Select
                showSearch
                style={{
                  width: "1000px",
                  marginLeft: "0px"
                }}
                placeholder="Select Collection"
                optionFilterProp="children"
                onChange={e => updateFormInput({ ...formInput, CollectionName: e })}
              >
                {NFTCollections &&
                  NFTCollections.map((collection, i) =>
                    <Option value={collection.name} key={i}>{collection.name}</Option>
                  )
                }
              </Select>
            </div>
            <div className="mb-6 pt-5">
              <label htmlFor="username-success" className="block mb-2 text-sm font-medium">Bet Amount</label>
              <input type="text" id="username-success" className=" border  text-sm rounded-lg  block w-full p-2.5 dark:bg-green-100 dark:border-green-400" placeholder="Amount in MATIC"
                onChange={e => chooseamount(e.target.value)} required />

            </div>
            <div className="input-group mb-3 pt-3">
              <label htmlFor="username-success" className="block mb-2 text-sm font-medium">Date of Match</label>
              <Select
                showSearch
                style={{
                  width: "1000px",
                  marginLeft: "0px"
                }}
                placeholder="Select Collection"
                optionFilterProp="children"
                onChange={e => choose_collection1(e)}
              >
                {TeamGames &&
                  TeamGames.map((arr, i) =>
                    <Option value={arr.date} key={i}>{arr.date}</Option>
                    
                  )
                }
              </Select>
            </div>
            <div className="input-group mb-3 pt-3">
              <label htmlFor="username-success" className="block mb-2 text-sm font-medium">Team 1</label>
              <Select
                showSearch
                style={{
                  width: "1000px",
                  marginLeft: "0px"
                }}
                placeholder="Select Collection"
                optionFilterProp="children"
                onChange={e => choose_team1(e)}
              >
                 
                {Team1 &&
                  Team1.map((arr, i) =>
                   <Option value={arr} key={i}>{arr}</Option>
                            
                           )
                }
              </Select>
            </div>
            
            <div className="input-group mb-3 pt-3">
              <label htmlFor="username-success" className="block mb-2 text-sm font-medium">Team 2</label>
              <Select
                showSearch
                style={{
                  width: "1000px",
                  marginLeft: "0px"
                }}
                placeholder="Select Collection"
                optionFilterProp="children"
                onChange={e => choose_team2(e)}
              >
                 
                {Team2 &&
                  Team2.map((arr, i) =>
                   <Option value={arr} key={i}>{arr}</Option>
                            
                           )
                }
              </Select>
            </div>

              
            <div className='pt-7'>
            <button type="button" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full" onClick={sendlink}> Fund Link</button>
    <button type="button" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full" onClick={pullodds}> Pull odds (underdog)</button>
    <button type="button" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full" onClick={pullodds}> Pull odds (favorite)</button>
    <button type="button" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full" onClick={pullPointsover}> Pull Points (over)</button>
    <button type="button" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full" onClick={pullPointsunder}> Pull Points (under)</button>


          </div>
              
          <div className="relative" style={{  height: "300px", width:"800px" }}>
          <div className="absolute">

          <h1 className="text-2xl  mt-0 mb-2 pt-3">Bet Description NFT image:</h1>
          <canvas ref={canvas}></canvas>
            </div>
  
            <div className="absolute ml-20 flex flex-col justify-between " style={{ marginLeft: "400px",width:"800px" }}>
                <h1 className="text-2xl  mt-0 mb-2 pt-3">Alternative NFT image (optional)</h1>

                <div className="flex w-full h-full">
                  <label className="box-border h-64 w-64 border-2 border-dashed border-black hover:bg-gray-300 place-items-center">

                    <div className={fileUrl === null ? 'flex w-full h-full justify-center items-center' : "hidden"}>
                      <div className="flex w-full h-full justify-center items-center">
                        <div className="flex w-full h-full justify-center items-center" >
                        </div>
                      </div>
                    </div>
                    <input type='file' className="hidden" onChange={onChangeCouponImage} required/>
                    {
                      fileUrl && (
                        <img className="h-64 w-64 object-fill" width="" src={ImageUrl2} />
                      )
                    }
                  </label>
                </div>


              </div>
            </div>
            </div>

          <div className='pt-4'>
            <button type="button" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full" onClick={validate_form_server_side}>  Create NFT</button>
          </div>
        </form>




        <div className="input-group mb-3" id="resultSpace">
        </div>


      </div>


    </>
  );
}

export default CreatePass