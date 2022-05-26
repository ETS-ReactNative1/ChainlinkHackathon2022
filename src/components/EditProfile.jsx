import { useState } from 'react'
import { ethers, ContractFactory } from 'ethers'
import Web3Modal from 'web3modal'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import { useMoralis } from "react-moralis";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { Icon } from "antd";  //missing Image
//import { useNavigate } from "react-router-dom";
import Router from "next/router";
import { Switch } from 'antd';
const nftaddress = "0xb7F48F75348213e2F739f2C4026C6242f9526b8c"




export default function CreateItem() {
    const [fileUrl, setFileUrl] = useState(null)
    const [ImageUrl, setImageUrl] = useState(null)
    const [formInput, updateFormInput] = useState({ username: '', email: '' })
    const { Moralis, enableWeb3 } = useMoralis();
    const { chainId } = useMoralisDapp();
    const [checked, setChecked] = useState(false);
    //const navigate = useNavigate();

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
        const User = Moralis.Object.extend("User");
        const query = new Moralis.Query(User);
        const currentUser = Moralis.User.current();
        query.get(currentUser.id).then((res) => {
            console.log("profile:", res)
            //res.set("minted", "true")
            //res.set("owner", currentUser)
            //res.set("token_id", parseInt(token_id))
            //res.set("list_price", listPrice)
            //res.set("brand_image", imageURI)
            try {
                if (checked) {
                    //alert("setting user type to restaurant")
                    res.set("user_type", "restaurant")
                } else {
                    res.set("user_type", "client")
                }

                if (formInput.username.length > 0) {
                    res.set("username", formInput.username)
                }

                if (formInput.email.length > 0) {
                    res.set("email", formInput.email)
                }


                res.save()
                //alert("successfully updated user's profile!")
                Router.push('Profile');
            }
            catch (e) {
                console.log("expected handled error")
            }

            // The object was retrieved successfully.
        }, (error) => {
            // The object was not retrieved successfully.
            // error is a Moralis.Error with an error code and message.
        });
    }

    function log() {
        console.log("file url:", fileUrl)
    }

    async function onChange2(checked) {
        setChecked(checked);
        console.log(`switch to ${checked}`);
        console.log("checked!:", checked)


    }


    return (
        <>
            <div className="container">
                <div className="div">
                    <h1 className="text-4xl font-bold mt-0 mb-2 ">Edit Profile</h1>
                </div>

                <div className="form-group">
                    <div className="mb-6 pt-5">
                        <label htmlFor="username-success" className="block mb-2 text-sm font-medium">Your username</label>
                        <input type="text" id="username-success" className=" border  text-sm rounded-lg  block w-full p-2.5 dark:bg-green-100 dark:border-green-400" placeholder="Example: NFTLover478"
                            onChange={e => updateFormInput({ ...formInput, username: e.target.value })} />
                        {/* <p className="mt-2 text-sm text-green-600 dark:text-green-500"><span className="font-medium">Alright!</span> Collection Name available!</p> */}
                    </div>

                    <div className="mb-6">
                        <label htmlFor="username-success" className="block mb-2 text-sm font-medium">Email</label>
                        <input type="email" id="username-success" className=" border  text-sm rounded-lg  block w-full p-2.5 dark:bg-green-100 dark:border-green-400" placeholder="Example: exampleEmail@gmail.com"
                            onChange={e => updateFormInput({ ...formInput, email: e.target.value })} />
                        {/* <p className="mt-2 text-sm text-green-600 dark:text-green-500"><span className="font-medium">Alright!</span> Collection Name available!</p> */}
                    </div>




                    <div className="flex flex-row">
                        <Switch onChange={onChange2} />
                        <div className="pl-3 block mb-2 text-sm font-medium">Request Restaurant Verification (Dev Mode)</div>
                    </div>












                </div>



                <div className='pt-7'>
                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full" onClick={upload}>  Save Changes</button>
                </div>

            </div>


        </>
    );


}

