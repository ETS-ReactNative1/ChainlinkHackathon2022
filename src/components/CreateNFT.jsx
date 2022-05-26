import React, { useRef,useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import { Select } from 'antd';
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { Icon } from "antd";  //missing Image
import  Router from "next/router";


const nftaddress = "0xb7F48F75348213e2F739f2C4026C6242f9526b8c"


function CreateNFT() {
  //const [PromotionalFileUrl, setFileUrl] = useState(null)
  //const [fileUrl, setFileUrl] = useState(null)
  const [fileUrl, setFileUrl] = useState(null)
  const [ImageUrl, setImageUrl] = useState(null)
  const [ImageUrl2, setImageUrl2] = useState(null)

  const [BrandArtFileUrl, setBrandArtFileUrl] = useState(null)
  const [CouponFileUrl, setCouponFileUrl] = useState(null)


  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '', CollectionName: '', TokenName: '' })
  //const { Moralis , enableWeb3} = useMoralis();
  const [inputValue, setInputValue] = useState("");
  const { Option } = Select;
  const { chainId } = useMoralisDapp();
  //const { Moralis , enableWeb3} = useMoralis();
  const { Moralis, isWeb3Enabled, enableWeb3, isAuthenticated, isWeb3EnableLoading } = useMoralis();


  const [loadedCollections, setLoadedCollections] = useState('false');
  //var NFTCollections = getCollectionsByChain(chainId);
  const [NFTCollections, setNFTCollections] = useState([])
  const [rand, setRand] = useState('rand!')
  const canvas = useRef();
  let ctx = null;
  useEffect(() => {
    // dynamically assign the width and height to canvas
    const canvasEle = canvas.current;
    canvasEle.width = canvasEle.clientWidth;
    canvasEle.height = canvasEle.clientHeight;
 
    // get context of the canvas
    ctx = canvasEle.getContext("2d");
  }, []);
 
  useEffect(() => {
    writeText({ text: 'Clue Mediator!', x: 180, y: 70 });
 
    writeText({ text: 'Welcome to ', x: 180, y: 70 }, { textAlign: 'right' });
 
    writeText({ text: 'www.cluemediator.com', x: 180, y: 130 }, { fontSize: 30, color: 'green', textAlign: 'center' });
 
    writeText({ text: 'Like, Share and Subscribe...', x: 180, y: 200 }, { fontSize: 14, fontFamily: 'cursive', color: 'blue', textAlign: 'center' });
  }, []);
 
  // write a text
  const writeText = (info, style = {}) => {
    const { text, x, y } = info;
    const { fontSize = 20, fontFamily = 'Arial', color = 'black', textAlign = 'left', textBaseline = 'top' } = style;
 
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
    const file = e.target.files[0]
    //const fileInput = document.getElementById("file");
    //const data = fileInput.files[0];
    const imageFile = new Moralis.File(file.name, file);
    await imageFile.saveIPFS();
    const imageURI = imageFile.ipfs();
    console.log("imageURI btw:", imageURI)
    setImageUrl(imageURI)
    setFileUrl(file)
  }

  async function onChangeCouponImage(e) {
    const file = e.target.files[0]
    //const fileInput = document.getElementById("file");
    //const data = fileInput.files[0];
    const imageFile = new Moralis.File(file.name, file);
    await imageFile.saveIPFS();
    const imageURI = imageFile.ipfs();
    console.log("imageURI btw:", imageURI)
    setImageUrl2(imageURI)
    setCouponFileUrl(file)
  }


  function validate_form_server_side() {
    //
    //console.log("fileUrl:", fileUrl)
    if (formInput.name.length == 0 || formInput.description.length == 0) {
      //alert("Please fill out name and description!")
      //Do nothing --> client warns them to fill it out!
      //console.log("Empty Collection Name!")
    } else if (CouponFileUrl == null) {
      alert("Please attach a coupon image!")
    } else if (fileUrl == null) {
      alert("Please attach a promotional art image!")
    }

    else {
      upload()
    }
  }

  async function upload() {
    const imageFile = new Moralis.File(fileUrl.name, fileUrl);
    await imageFile.saveIPFS();
    const imageURI = imageFile.ipfs();

    const couponImageFile = new Moralis.File(CouponFileUrl.name, CouponFileUrl);
    await couponImageFile.saveIPFS();
    const couponImageURI = couponImageFile.ipfs();
    console.log("couponImageURI btw:", couponImageURI)

    console.log("imageURI btw:", imageURI)
    //alert("image uri:",imageURI)
    const metadata = {
      "name": formInput.name,
      "description": formInput.description,
      "image": imageURI,
      "couponImage": couponImageURI,
      //""
      //"name":document.getElementById("name").value,
      //"description":document.getElementById("description").value,
      //"image":imageURI
    }
    const metadataFile = new Moralis.File("metadata.json", { base64: btoa(JSON.stringify(metadata)) });
    await metadataFile.saveIPFS();
    const metadataURI = metadataFile.ipfs();
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
          meta.set("Collection", coll);
          meta.set("minted", "false");
          meta.save();

        } else {

          console.log("res:", res)

          const Metadata = Moralis.Object.extend("NFTMetadata");
          const meta = new Metadata();
          meta.set("URI", metadataURI);
          meta.set("CurrUser", currentUser);
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
        meta.set("Collection", res[0]);
        meta.set("minted", "false");
        meta.save();
        //alert("Successfully saved NFT to collection!", res[0])
        Router.push('Profile');

      }).catch(function (error) {
        console.log("error!")
      })
    }

  }


  async function cloud() {
    Moralis.Cloud.run("getCollections").then(function (res) {
      //if (res.length > 0) {
      //  //alert("MAJOR ALERT!")
      //}
      console.log("res:", res)
      //setCreatedNFTs(res)
      //setLoaded('true')
    })

    Moralis.Cloud.run("getCollections").then(function (res) {
      //if (res.length > 0) {
      //  //alert("MAJOR ALERT!")
      //}
      console.log("Collections!:", res)
      //setCreatedNFTs(res)
      //setLoaded('true')
    })
  }






  return (
    <>
      <div className="container">
        <div className="div">
          <h1 className="text-4xl font-bold mt-0 mb-2 ">Create a Coupon</h1>
        </div>

        <div className="block mb-2 text-sm font-medium pt-3">After creating a coupon, you can mint and immediately airdrop pass holders these coupons whenever you would like!</div>

        <form>
          <div className="form-group">

            <div className="mb-6 pt-5">
              <label htmlFor="username-success" className="block mb-2 text-sm font-medium">Your coupon name</label>
              <input type="text" id="username-success" className=" border  text-sm rounded-lg  block w-full p-2.5 dark:bg-green-100 dark:border-green-400" placeholder="Example: McNuggets"
                onChange={e => updateFormInput({ ...formInput, name: e.target.value })} required />

            </div>

            <div className="mb-6">
              <label htmlFor="username-success" className="block mb-2 text-sm font-medium">Description</label>
              <input type="text" id="username-success" className=" border  text-sm rounded-lg  block w-full p-2.5 dark:bg-green-100 dark:border-green-400" placeholder="Example: Coupon for McDonald's Mcnuggets"
                onChange={e => updateFormInput({ ...formInput, description: e.target.value })} required />
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


            <div className="flex mb-4 grid grid-cols-2 pt-6">
              <div className="w-500 h-700">
                <div className="block mb-2 text-sm font-medium">Promotional Art</div>
                <div className="flex w-full h-full">
                  <label className="box-border h-64 w-64 border-2 border-dashed border-black hover:bg-gray-300 place-items-center">

                    <div className={fileUrl === null ? 'flex w-full h-full justify-center items-center' : "hidden"}>
                      <div className="flex w-full h-full justify-center items-center">
                        <div className="flex w-full h-full justify-center items-center" >

                          <Icon type="file-image" width="5em" height="5em" style={{ fontSize: '500%' }} theme="outlined" />
                        </div>
                      </div>
                    </div>
                    <input type='file' className="hidden" onChange={onChange} required/>
                    {
                      fileUrl && (
                        <img className="h-64 w-64 object-fill" width="" src={ImageUrl} />
                      )
                    }
                  </label>
                </div>

              </div>
              <div className="w-500 h-700">
                <div className="block mb-2 text-sm font-medium">Coupon Image</div>
                <div className="flex w-full h-full">
                  <label className="box-border h-64 w-64 border-2 border-dashed border-black hover:bg-gray-300 place-items-center">

                    <div className={fileUrl === null ? 'flex w-full h-full justify-center items-center' : "hidden"}>
                      <div className="flex w-full h-full justify-center items-center">
                        <div className="flex w-full h-full justify-center items-center" >

                          <Icon type="file-image" width="5em" height="5em" style={{ fontSize: '500%' }} theme="outlined" />
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

<div>

        <h3>Write text on Canvas - <a href="http://www.cluemediator.com" target="_blank" rel="noopener noreferrer">Clue Mediator</a></h3>
      <canvas ref={canvas}></canvas>
</div>

          <div className='pt-7'>
            <button type="button" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full" onClick={validate_form_server_side}>  Create NFT</button>
          </div>
        </form>

        {/*         <div className='pt-7'>
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full" onClick={cloud}>  Create NFT</button>
        </div> */}



        <div className="input-group mb-3" id="resultSpace">
        </div>
      </div>


    </>
  );
}

export default CreateNFT