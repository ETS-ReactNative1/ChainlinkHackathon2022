import React, { useState } from "react";
import { useMoralis } from "react-moralis";

function Contact() {
    const [formInput, updateFormInput] = useState({ name: '', email: '', company_name: '', state: '', message: '' })
    const { Moralis } = useMoralis();

    function validate_form_server_side() {
        if (formInput.name.length == 0 || formInput.email.length == 0 || formInput.message.length == 0) {
            alert("Please fill out name, email, and message")
        }
        else {
            submit_form()
        }
    }

    function submit_form() {
        var params = formInput
        sendContactEmailToUser(params)
        sendContactEmailToCouponMint(params)

    }
    async function sendContactEmailToUser(params) {
        try {
            await Moralis.Cloud.run("sendContactEmailToUser", params);
            //alert("successfully sent email to user!")
        }
        catch (e) {
            console.log("error!2", e)
            alert("problem with sending email")
        }
    }


    async function sendContactEmailToCouponMint(params) {
        try {

            await Moralis.Cloud.run("sendContactEmailToCouponMint", params);
            alert("Successfully sent email! We will get back to you as soon as possible!")
        }
        catch (e) {
            console.log("error!1", e)
            alert("problem with sending email")
        }
    }


    return (
        <div className=" h-96 w-full bg-white">

            <div className="w-full flex items-center bg-white  justify-center my-12">

                <div className="absolute top-40 bg-white shadow rounded py-12  lg:px-28 px-8">

                    <p className="md:text-3xl text-xl font-bold leading-7 text-center text-gray-700">Email us for business inquiries!</p>
                    <div className="md:flex items-center mt-12">
                        <div className="md:w-72 flex flex-col">
                            <label className="text-base font-semibold leading-none text-gray-800">Name</label>
                            <input tabIndex={0} arial-label="Please input name" type="name"
                                className="text-base leading-none text-gray-900 p-3 focus:oultine-none focus:border-indigo-700 mt-4 bg-gray-100 border rounded border-gray-200 placeholder-gray-100"
                                placeholder="Please input  name"
                                onChange={e => updateFormInput({ ...formInput, name: e.target.value })}

                            />

                        </div>
                        <div className="md:w-72 flex flex-col md:ml-6 md:mt-0 mt-4">
                            <label className="text-base font-semibold leading-none text-gray-800">Email Address</label>
                            <input tabIndex={0} arial-label="Please input email address" type="name"
                                className="text-base leading-none text-gray-900 p-3 focus:oultine-none focus:border-indigo-700 mt-4 bg-gray-100 border rounded border-gray-200 placeholder-gray-100"
                                placeholder="Please input email address"
                                onChange={e => updateFormInput({ ...formInput, email: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="md:flex items-center mt-8">
                        <div className="md:w-72 flex flex-col">
                            <label className="text-base font-semibold leading-none text-gray-800">Company Name</label>
                            <input tabIndex={0} role="input" arial-label="Please input company name" type="name"
                                className="text-base leading-none text-gray-900 p-3 focus:oultine-none focus:border-indigo-700 mt-4 bg-gray-100 border rounded border-gray-200 placeholder-gray-100 "
                                placeholder="Please input company name"
                                onChange={e => updateFormInput({ ...formInput, company_name: e.target.value })}


                            />
                        </div>
                        <div className="md:w-72 flex flex-col md:ml-6 md:mt-0 mt-4">
                            <label className="text-base font-semibold leading-none text-gray-800">State</label>
                            <input tabIndex={0} arial-label="Please input state name" type="name"
                                className="text-base leading-none text-gray-900 p-3 focus:oultine-none focus:border-indigo-700 mt-4 bg-gray-100 border rounded border-gray-200 placeholder-gray-100"
                                placeholder="Please input country name"
                                onChange={e => updateFormInput({ ...formInput, state: e.target.value })}

                            />
                        </div>
                    </div>
                    <div>
                        <div className="w-full flex flex-col mt-8">
                            <label className="text-base font-semibold leading-none text-gray-800">Message</label>
                            <textarea tabIndex={0} aria-label="leave a message" role="textbox" type="name"
                                className="h-36 text-base leading-none text-gray-900 p-3 focus:oultine-none focus:border-indigo-700 mt-4 bg-gray-100 border rounded border-gray-200 placeholder-gray-100 resize-none"
                                defaultValue={""}
                                onChange={e => updateFormInput({ ...formInput, message: e.target.value })}

                            />
                        </div>
                    </div>
                    {/* <p className="text-xs leading-3 text-gray-600 mt-4">By clicking submit you agree to our terms of service, privacy policy and how we use data as stated</p> */}
                    <div className="flex items-center justify-center w-full">
                        <button className="mt-9 text-base font-semibold leading-none text-white py-4 px-10 bg-indigo-700 rounded hover:bg-indigo-600 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 focus:outline-none"
                            onClick={validate_form_server_side}>  SUBMIT</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contact;
