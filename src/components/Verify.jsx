import { useState } from 'react'
import { ethers, ContractFactory } from 'ethers'
import Web3Modal from 'web3modal'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import { useMoralis } from "react-moralis";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { Icon } from "antd";  //missing Image
//import { useNavigate } from "react-router-dom";
import { Switch } from 'antd';
import Router from "next/router";

const nftaddress = "0xb7F48F75348213e2F739f2C4026C6242f9526b8c"




export default function CreateItem() {
    const [fileUrl, setFileUrl] = useState(null)
    const [ImageUrl, setImageUrl] = useState(null)
    //const [formInput, updateFormInput] = useState({ username: '' , restaurant_name: '', state: '', zip_code: '', country: '', owner:'', manager: '', email : '', country: ''})
    const [formInput, updateFormInput] = useState({ restaurant_name: '', owner: '', manager: '', email: '', address: '', state: '', city: '', zip_code: '', country: '' })

    const { Moralis, enableWeb3 } = useMoralis();
    const { chainId } = useMoralisDapp();
    const [checked, setChecked] = useState(false);
    //const navigate = useNavigate();
    const {isAuthenticated } = useMoralis();


    async function onChange(e) {
        const file = e.target.files[0]
        console.log("File:", file)
        //const fileInput = document.getElementById("file");
        //const data = fileInput.files[0];
        const imageFile = new Moralis.File(file.name, file);
        await imageFile.saveIPFS();
        const imageURI = imageFile.ipfs();
        console.log("imageURI btw:", imageURI)
        setImageUrl(imageURI)

        //try {
        //  const added = await client.add(
        //    file,
        //    {
        //      progress: (prog) => console.log(`received: ${prog}`)
        //    }
        //  )
        //  const url = `https://ipfs.infura.io/ipfs/${added.path}`
        setFileUrl(file)
        //} catch (error) {
        //  console.log('Error uploading file: ', error)
        //}  
    }



    async function upload() {
        if (isAuthenticated) {
            upload_auth()
        } else {
            upload_unauth()
        }
 
    }

    async function upload_unauth() {
        //alert("HERE")
        const Restaurant = Moralis.Object.extend("Restaurant");
        const query = new Moralis.Query(Restaurant);
        //const currentUser = Moralis.User.current();
        //console.log("CURRENT USER:",currentUser)
        console.log("formInput:", formInput)
        //query.equalTo("user", currentUser)
        query.equalTo("restaurant_name", formInput.restaurant_name)
        query.equalTo("owner", formInput.owner)
        query.equalTo("manager", formInput.manager)
        query.equalTo("email", formInput.email)
        query.equalTo("address", formInput.address)
        query.equalTo("state", formInput.state)
        query.equalTo("city", formInput.city)
        query.equalTo("zip_code", formInput.zip_code)
        query.equalTo("country", formInput.country)
        await query.find().then((res) => {
            if (res == 0) {
                //alert("res is 0!")
                const rest = new Restaurant();
                //rest.set("user", currentUser)
                rest.set("restaurant_name", formInput.restaurant_name)
                rest.set("owner", formInput.owner)
                rest.set("manager", formInput.manager)
                rest.set("email", formInput.email)
                rest.set("address", formInput.address)
                rest.set("state", formInput.state)
                rest.set("city", formInput.city)
                rest.set("zip_code", formInput.zip_code)
                rest.set("country", formInput.country)
                rest.set("verified", "false")
                rest.save();
                //alert("s!")
                var params = formInput
                //params["user"] = currentUser.id
                console.log("params:", params)
                sendEmailToCouponMint(params)
                sendEmailToRestaurant(params)
                //alert("Successfully sent request!")
                Router.push({
                    pathname: '/nftmarketplace',
                    query: { id: "explore"},
                })
            }


        }, (error) => {
            // The object was not retrieved successfully.
            // error is a Moralis.Error with an error code and message.
        });
    }


    async function upload_auth() {
        const Restaurant = Moralis.Object.extend("Restaurant");
        const query = new Moralis.Query(Restaurant);
        const currentUser = Moralis.User.current();
        console.log("CURRENT USER:",currentUser)
        console.log("formInput:", formInput)
        query.equalTo("user", currentUser)
        query.equalTo("restaurant_name", formInput.restaurant_name)
        query.equalTo("owner", formInput.owner)
        query.equalTo("manager", formInput.manager)
        query.equalTo("email", formInput.email)
        query.equalTo("address", formInput.address)
        query.equalTo("state", formInput.state)
        query.equalTo("city", formInput.city)
        query.equalTo("zip_code", formInput.zip_code)
        query.equalTo("country", formInput.country)
        await query.find().then((res) => {
            if (res == 0) {
                //alert("res is 0!")
                const rest = new Restaurant();
                rest.set("user", currentUser)
                rest.set("restaurant_name", formInput.restaurant_name)
                rest.set("owner", formInput.owner)
                rest.set("manager", formInput.manager)
                rest.set("email", formInput.email)
                rest.set("address", formInput.address)
                rest.set("state", formInput.state)
                rest.set("city", formInput.city)
                rest.set("zip_code", formInput.zip_code)
                rest.set("country", formInput.country)
                rest.set("verified", "false")
                rest.save();
                //alert("s!")
                var params = formInput
                params["user"] = currentUser.id
                console.log("params:", params)
                sendEmailToCouponMint(params)
                sendEmailToRestaurant(params)
                //alert("Successfully sent request!")
                Router.push({
                    pathname: '/nftmarketplace',
                    query: { id: "explore"},
                })
            }


        }, (error) => {
            // The object was not retrieved successfully.
            // error is a Moralis.Error with an error code and message.
        });
    }

    async function sendEmailToCouponMint(params) {
        //await Moralis.Cloud.run("sendEmailToSeller", params); 

        try {

            await Moralis.Cloud.run("sendVerificationRequestToCouponMint", params);
            //await Moralis.Cloud.run("sendEmailToUser",params);
            //console.log("")
            //alert("Successfully sent email to CouponMint!")
            //alert("Successfully sent request!")

        }
        catch (e) {
            console.log("error!1", e)
            alert("david1")
        }
    }

    async function sendEmailToRestaurant(params) {
        //await Moralis.Cloud.run("sendEmailToSeller", params); 

        try {

            await Moralis.Cloud.run("sendVerificationRequestToRestaurant", params);
            //await Moralis.Cloud.run("sendEmailToUser",params);
            //console.log("")
            //alert("Successfully sent email to Restaurant!")
            //alert("Successfully sent request!")

        }
        catch (e) {
            console.log("error!2", e)
            alert("david2")
        }
    }



 


    return (
        <>
            <div className="container">
                <div className="div">
                    <h1 className="text-4xl font-bold mt-0 mb-2 "> Expert Verification Request Form</h1>
                </div>

                <div className="block mb-2 text-sm font-medium pt-3">Thank you for your interest in being an expert at ParlayMint!</div>
                <div className="block mb-2 text-sm font-medium pt-3">Please fill out the form below so we can verify you and get you started.</div>

                <div className="form-group">
                    <div className="mb-2 pt-5">
                        <label htmlFor="username-success" className="block mb-2 text-sm font-medium">Your Name</label>
                        <input type="text" id="username-success" className=" border  text-sm rounded-lg  block w-full p-2.5 dark:bg-green-100 dark:border-green-400" placeholder="Enter Your Name"
                            onChange={e => updateFormInput({ ...formInput, restaurant_name: e.target.value })} />
                        {/* <p className="mt-2 text-sm text-green-600 dark:text-green-500"><span className="font-medium">Alright!</span> Collection Name available!</p> */}
                    </div>



                    <div className="mb-2">
                        <label htmlFor="username-success" className="block mb-2 text-sm font-medium">Primary Email Contact</label>
                        <input type="email" id="username-success" className=" border  text-sm rounded-lg  block w-full p-2.5 dark:bg-green-100 dark:border-green-400" placeholder="Enter Email"
                            onChange={e => updateFormInput({ ...formInput, email: e.target.value })} />
                        {/* <p className="mt-2 text-sm text-green-600 dark:text-green-500"><span className="font-medium">Alright!</span> Collection Name available!</p> */}
                    </div>

     
                    <div className="mb-2">
                        <label htmlFor="username-success" className="block mb-2 text-sm font-medium">City</label>
                        <input type="email" id="username-success" className=" border  text-sm rounded-lg  block w-full p-2.5 dark:bg-green-100 dark:border-green-400" placeholder="Enter City"
                            onChange={e => updateFormInput({ ...formInput, city: e.target.value })} />
                        {/* <p className="mt-2 text-sm text-green-600 dark:text-green-500"><span className="font-medium">Alright!</span> Collection Name available!</p> */}
                    </div>

                    <div className="mb-2">
                        <label htmlFor="username-success" className="block mb-2 text-sm font-medium">State</label>
                        <input type="email" id="username-success" className=" border  text-sm rounded-lg  block w-full p-2.5 dark:bg-green-100 dark:border-green-400" placeholder="Enter State"
                            onChange={e => updateFormInput({ ...formInput, state: e.target.value })} />
                        {/* <p className="mt-2 text-sm text-green-600 dark:text-green-500"><span className="font-medium">Alright!</span> Collection Name available!</p> */}
                    </div>

                    <div className="mb-2">
                        <label htmlFor="username-success" className="block mb-2 text-sm font-medium">Zip Code</label>
                        <input type="email" id="username-success" className=" border  text-sm rounded-lg  block w-full p-2.5 dark:bg-green-100 dark:border-green-400" placeholder="Enter Zip Code"
                            onChange={e => updateFormInput({ ...formInput, zip_code: e.target.value })} />
                        {/* <p className="mt-2 text-sm text-green-600 dark:text-green-500"><span className="font-medium">Alright!</span> Collection Name available!</p> */}
                    </div>

                    <div className="mb-2">
                        <label htmlFor="username-success" className="block mb-2 text-sm font-medium">Country</label>
                        <input type="email" id="username-success" className=" border  text-sm rounded-lg  block w-full p-2.5 dark:bg-green-100 dark:border-green-400" placeholder="Enter Country"
                            onChange={e => updateFormInput({ ...formInput, country: e.target.value })} />
                        {/* <p className="mt-2 text-sm text-green-600 dark:text-green-500"><span className="font-medium">Alright!</span> Collection Name available!</p> */}
                    </div>









                </div>



                <div className='pt-7'>
                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full" onClick={upload}>  Request</button>
                </div>

            </div>


        </>
    );


}

