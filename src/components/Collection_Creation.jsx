import { useState, useEffect } from 'react'
import { useMoralis } from "react-moralis";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
//import { useHistory } from "react-router-dom";
import { Select } from 'antd';
import { useRouter } from 'next/router'
import Link from "next/link";
import ErrorPage from "./ErrorPage";



function Collection_Creation() {
    const [fileUrl, setFileUrl] = useState(null)
    const [ImageUrl, setImageUrl] = useState(null)
    const [formInput, updateFormInput] = useState({ price: '', name: '', description: '', CollectionName: '', TokenName: '', RestaurantObjectId: '', })
    const { Moralis ,isAuthenticated} = useMoralis();
    const { walletAddress, chainId } = useMoralisDapp();
    //const navigate = useNavigate();
    const [rand, setRand] = useState('rand!')
    const router = useRouter()
    const [loaded, setLoaded] = useState('false')
    const [restaurants, setRestaurants] = useState([])
    const { Option } = Select;
    const [Team1, setTeam1] = useState(["NBA","MLB","NHL","NFL"])
    const [UserType, setUserType] = useState("explore");

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    //This hook just loads all the restaurants the current user is managing (it is )
    useEffect(() => {
        if (loaded == 'false') {


            if (typeof (walletAddress) == "string") {
                request()

                check_for_multiple_restaurants().then(function (res) {
                    try {
                        setRestaurants(res)
                        setLoaded('true')
                    }
                    catch (e) {
                        //
                    }
                })
            }
        } else {
            setRand("rancid")

        }
    });

    const request = async () => {
        //Quick fix: I put this in a try catch since sometimes there are parse.initialize errors 
        //(this happens when moralis doesn't get initialized fast enough with the useMoralis() and enableWeb3() calls)
        //There's probably a cleaner solution, but for now this works 
        try {
          const User = Moralis.Object.extend("User");
          const query = new Moralis.Query(User);
          const currentUser = Moralis.User.current();
          //console.log("current user:", currentUser)
          await query.get(currentUser.id).then((res) => {
            // console.log("profile:", res)
            //FIX LOADING LOGIC!!!!!!
            if (res.attributes.user_type.length > 0) {
              //console.log("GOLDEN USER TYPE:", res.attributes.user_type)
              setUserType(res.attributes.user_type)
            } else {
              setUserType("client")
            }
          }, (error) => {
            // The object was not retrieved successfully.
            // error is a Moralis.Error with an error code and message.
          });
        }
        catch (e) {
        }
    
      }
    async function check_for_multiple_restaurants() {
        //console.log("check!!")
        //console.log("Fetching profile image!")
        const Restaurant = Moralis.Object.extend("Restaurant");
        const query = new Moralis.Query(Restaurant);
        const currentUser = Moralis.User.current();
        //console.log("current user:", currentUser)
        query.equalTo("user", currentUser)
        //query.equalTo("objectId",currentUser.objectId)
        //const results = await query.find();
        //var img_url = ""
        var rests = []
        await query.find().then((res) => {
            //console.log("RES:", res)
            //console.log("")
            //console.log("res:", res)
            for (let i = 0; i < res.length; i++) {
                const object = res[i];
                //console.log("obj:", object)
                //rests.push(object.id)
                var id = object.id
                var rest = {
                    id: object.id,
                    name: object.attributes.restaurant_name,
                    addr: object.attributes.address,
                    city: object.attributes.city,
                    state: object.attributes.state
                }
                rests.push(rest)
            }
            //return rests
        }, (error) => {
            //console.log("error!")
            // The object was not retrieved successfully.
            // error is a Moralis.Error with an error code and message.
        });

        //return ""
        return rests
    }


    async function onChange(e) {
        const file = e.target.files[0]
        //console.log("File:", file)
        //const fileInput = document.getElementById("file");
        //const data = fileInput.files[0];
        const imageFile = new Moralis.File(file.name, file);
        await imageFile.saveIPFS();
        const imageURI = imageFile.ipfs();
        console.log("imageURI btw:", imageURI)
        console.log("file:", file)
        setImageUrl(imageURI)
        setFileUrl(file)
    }

    function validate_form_server_side() {
        //
        //console.log("fileUrl:", fileUrl)
        if (formInput.CollectionName.length == 0) {
            //Do nothing --> client warns them to fill it out!
            //console.log("Empty Collection Name!")
            console.log("not working!")
            alert("please fill out the pass name!")
        } else if (formInput.RestaurantObjectId == '') {
            alert("Please select a restaurant!")
            //} else if (fileUrl) {
            //
        } else if (fileUrl == null) {
            alert("Please attach a collection banner image!")
        }

        else {
            upload()
        }
    }

    async function upload() {

        console.log("uploading!")

        const CollectionsTracker = Moralis.Object.extend("CollectionsTracker");
        const query = new Moralis.Query(CollectionsTracker);
        const currentUser = Moralis.User.current();
        query.equalTo("collection_name", formInput.CollectionName);
        query.find().then(function (res) {
            console.log("QUERYING!")
            if (parseInt(formInput.RoyaltyPercent) <= 10) {
                if (res.length === 0) {
                    console.log("unique collection name! --> setting the guys!")
                    var token_name = "CouponMint";
                    const coll = new CollectionsTracker();
                    coll.set("collection_name", formInput.CollectionName);
                    coll.set("restaurant_id", formInput.RestaurantObjectId);
                    coll.set("token_name", token_name);
                    coll.set("image", ImageUrl);
                    coll.set("chain_id", chainId);
                    coll.set("CurrUser", currentUser);
                    coll.set("royalty_percent", formInput.RoyaltyPercent);
                    coll.set("Minted_wallet", walletAddress);


                    coll.save();
                    //navigate("/");
                    //alert("successfully saved collection!")
                    router.push('CreatePass');

                } else {
                    alert("Collection with this name already exists! Please choose another collection name!")
                }
            } else {
                alert("Royalty Percentage may not be more than 10%!")
            }
        }).catch(function (error) {
            console.log("error!")
            console.log("error!", error)
        })


    }


    async function cloud_func() {
        const currentUser = Moralis.User.current();
        console.log("current User:", currentUser.id)
        var params = { seller: "0x1676b3E4282AeA747BC64E955E939Af7e920A2bf".toLowerCase(), user: currentUser.id }
        getUsers(params)
    }


    async function getUsers(params) {
        //await Moralis.Cloud.run("sendEmailToSeller", params); 
        try {
            const res = await Moralis.Cloud.run("getCollectionLocations2");
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



    async function cloud() {
        //GFKSKJF
        try {
            const params = { listPrice: "0.07", name: "Major Deal", getEmail: "motocrossriderracer@gmail.com" };
            await Moralis.Cloud.run("sendEmailToSeller", params);
            //await Moralis.Cloud.run("sendEmailToUser",params);
            //alert("big shan")

        }
        catch (e) {
            console.log("error!", e)
            alert("david")
        }
    }

    function preventRefresh(event) {
        event.preventDefault();
    }

    if(isAuthenticated && UserType=="restaurant"){
    return (
        <>
            <div className="container">



                <div className="div">
                    <h1 className="text-4xl font-bold mt-0 mb-2 ">Create Collection of NFTs</h1>
                </div>

                <div className="block mb-2 text-sm font-medium pt-3">You can create collections of NFTs for organizing your bets</div>
                <div className="block mb-2 text-sm font-medium pt-3">Your collection can be viewed by other people to build your rep!</div>

                <form onSubmit={preventRefresh}>


                    <div className="form-group">
                        <div className="mb-6 pt-5">
                            <label htmlFor="username-success" className="block mb-2 text-sm font-medium">Your collection name</label>
                            <input type="text" id="username-success" className=" border  text-sm rounded-lg  block w-full p-2.5 dark:bg-green-100 dark:border-green-400" placeholder="Ex: ZL's GOAT bets"
                                onChange={e => updateFormInput({ ...formInput, CollectionName: e.target.value })} required />
                        </div>
                        <div className="input-group mb-3 pt-3">
                            <label htmlFor="username-success" className="block mb-2 text-sm font-medium">Select Sport</label>
                            <Select
                                showSearch
                                style={{
                                    width: "1000px",
                                    marginLeft: "0px"
                                }}
                                placeholder="Select Collection"
                                optionFilterProp="children"
                                onChange={e => updateFormInput({ ...formInput, RestaurantObjectId: e })}
                            >
                 {Team1 &&
                  Team1.map((arr, i) =>
                   <Option value={arr} key={i}>{arr}</Option>
                            
                           )
                }
                            </Select>
                        </div>
                        <div className="mb-6 pt-5">
                            <label htmlFor="username-success" className="block mb-2 text-sm font-medium">Your Roylaty Percentage</label>
                            <input type="text" id="username-success" className=" border  text-sm rounded-lg  block w-full p-2.5 dark:bg-green-100 dark:border-green-400" placeholder="May not be more than 10%"
                                onChange={e => updateFormInput({ ...formInput, RoyaltyPercent: e.target.value })} required />
                        </div>
                        <div>
                            <div className="block mb-2 text-sm font-medium">Collection Banner Image</div>
                            <div className="flex w-full h-full">
                                <label className="box-border h-64 w-64 border-2 border-dashed border-black hover:bg-gray-300 place-items-center">
                                    <div className={fileUrl === null ? 'flex w-full h-full justify-center items-center' : "hidden"}>
                                        <div className="flex w-full h-full justify-center items-center">
                                            <div className="flex w-full h-full justify-center items-center" >
                                            </div>
                                        </div>
                                    </div>
                                    <input type='file' className="hidden" onChange={onChange} required />
                                    {
                                        fileUrl && (
                                            <img className="h-64 w-64 object-fill" width="" src={ImageUrl} />
                                        )
                                    }
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className='pt-7'>
                        <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full" onClick={validate_form_server_side}>  Save Collection</button>
                    </div>
                    
                </form>

            </div>


        </>
    );

}else {
    return <ErrorPage />;
  
  }
}

export default Collection_Creation;
