import { Select, Divider, Input, Typography, Space, Avatar, Image } from 'antd';
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { getCollectionsByChain } from "helpers/collections";
import { useMoralis } from "react-moralis";
import React, { useState, useEffect } from "react";
import Router from 'next/router'
// import "../styles/style.module.css";
import "../styles/search.module.css";
import { DownCircleTwoTone, UserOutlined } from '@ant-design/icons'

//Ideal Functionality: Search by Collections, Items, and Accounts
//Worry about items after NFT Details merge
//For searching by accounts, by default search for wallet address
//Later should incorporate usernames (this will require redesigning a bit of the ProfileQuery Component)

//Loading functionality: The correct way to implement this is to only query all accounts + collections when 
//a user actually clicks on the search bar. This is more efficient + how other NFT marketplaces do it

const styles3 = {
    content: {
        width: "1000px",
        marginLeft: "20px",
        // backgroundColor: "green",
        borderColor: "black",
        borderRadius: "16px",
        borderWidth: "2px"

    },
    optgroup: {
        color: "green",
        backgroundColor: "green",
        fontSize: "60px"
    }
};


function SearchCollections({ setInputValue }) {
    const { Option, OptGroup } = Select;
    const { chainId } = useMoralisDapp();
    //const { Moralis , enableWeb3} = useMoralis();
    const { Moralis, isWeb3Enabled, enableWeb3, isAuthenticated, isWeb3EnableLoading } =
        useMoralis();

    //const NFTCollections = getCollectionsByChain(chainId);
    //var NFTCollections = getCollectionsByChain(chainId);
    //var NFTCollections = []
    //console.log("NFT Collection stuff:",NFTCollections)

    const [loadedCollections, setLoadedCollections] = useState('false');
    //var NFTCollections = getCollectionsByChain(chainId);
    const [NFTCollections, setNFTCollections] = useState(getCollectionsByChain(chainId));
    const [rand, setRand] = useState('rand!')
    const [users, setUsers] = useState([]);
    const [loadedUsers, setLoadedUsers] = useState(false);


    useEffect(() => {


        if (loadedCollections === 'false') {

            try {
                const CollectionsTracker = Moralis.Object.extend("CollectionsTracker");
                const query = new Moralis.Query(CollectionsTracker);
                query_collections(query).then(function (res) {
                    setNFTCollections(res)
                    setLoadedCollections('true')
                });
            }

            catch (e) {
                //console.log("e:",e)
            }
        }

        if (!loadedUsers) {
            search_users().then(function (res) {
                if (typeof res !== 'undefined') {
                    if (res.length > 0) {
                        console.log("Users btw:", res)
                        setUsers(res)
                        setLoadedUsers(true)
                    }
                }
            })
        }




    });


    async function search_users() {
        try {
            const results = await Moralis.Cloud.run("search_users");
            if (typeof results !== 'undefined') {
                if (results.length > 0) {
                    return results
                }
            }
            return results
        }
        catch (e) {
            //console.log("error!", e)
            //console.log("david")
        }
    }


    async function query_collections(query) {
        var arr = []
        try {
            await query.find().then(function (results) {
                console.log("results:", results)

                for (var i = 0; i < results.length; i++) {
                    var coll = {
                        image:
                            results[i].get('image'),
                        name: results[i].get('collection_name'),
                        addrs: results[i].get('NFTsol_addr'),
                    }
                    arr.push(coll)
                }
                //NFTCollections.push()
                //setCreatedNFTs(res)
                console.log("nft collections arr:", arr)
                //setNFTCollections(arr)
                //setLoadedCollections('true')
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

    //useEffect(() => {
    //      if (loadedCollections == 'false') {
    //          const CollectionsTracker = Moralis.Object.extend("CollectionsTracker");
    //          const query = new Moralis.Query(CollectionsTracker);
    //          query.find().then(function(results) {
    //            //console.log("results:",results)
    //            var arr = []
    //            for (var i = 0; i < results.length; i++) {
    //              var coll = {
    //                image:
    //                "https://lh3.googleusercontent.com/BWCni9INm--eqCK800BbRkL10zGyflxfPwTHt4XphMSWG3XZvPx1JyGdfU9vSor8K046DJg-Q8Y4ioUlWHiCZqgR_L00w4vcbA-w=s0",
    //              name: results[i].get('collection_name'),
    //              addrs: results[i].get('NFTsol_addr'),
    //              }
    //              arr.push(coll)
    //            }
    //            //NFTCollections.push()
    //            //setCreatedNFTs(res)
    //            setNFTCollections(arr)
    //            setLoadedCollections('true')
    //          })
    //          .catch(function(error) {
    //            // There was an error.
    //          });
    //      } else {
    //          //console.log("loaded!")
    //      }
    //    });


    function onChange(value) {
        console.log("THE VALUE BTW:", value)
        try {
            if (value.includes("-")) {
                console.log("HERE!:", value)
                setInputValue(value.slice(1, value.length));
                Router.push({
                    pathname: '/nftmarketplace',
                    query: { id: value.slice(1, value.length) },
                })
            } else {
                Router.push({
                    pathname: '/profile/' + value,
                    //query: { id: value },
                })

            }

        } catch (e) {

        }

    }

    function onChangeProfile(value) {
        //setInputValue(value);
        Router.push({
            pathname: '/profile/' + value,
            //query: { id: value },
        })
    }

    function logger() {
        console.log("change")
    }

    return (
        <>
            {/* <Select
                showSearch
                style={{
                    width: "1000px",
                    marginLeft: "20px"
                }}
                placeholder="Find a Collection"
                optionFilterProp="children"
                onChange={onChange}
            >
                {NFTCollections &&
                    NFTCollections.map((collection, i) =>
                        <Option value={collection.addrs} key={i}>{collection.name}</Option>
                    )
                }
            </Select> */}
            {/* <div className={s.optgroup1} >
                HHH
            </div> */}
            <Select
                value={null}
                autoClearSearchValue={true}
                allowClear={true}
                showSearch
                placeholder="Search for Collections and Accounts"
                optionFilterProp="children"
                // filterOption={(input, option) => {
                //     if (option.children) {
                //         //console.log("first 1 .children:",option.children)
                //         //console.log("input:",input)
                //         //return option.children
                //     } else if (option.label) {
                //         for (var i = 0; i < option.options.length; i++) {
                //             console.log("val to filter:", option.options[i].children)

                //             //option.options[i].children.indexOf(input.toUpperCase()) !== -1
                //             option.options[i].children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                //         }
                //         //console.log("input:",input)
                //         //console.log("2:option.children:",option.options)
                //         //console.log("option.label:",option.label)

                //         //return option.label
                //     }
                // }}
                // filterOption={(input, option) =>  
                //     // option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 
                //     // || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                //     console.log("option:",option);

                //     option.children.toUpperCase().indexOf(input.toUpperCase()) !== -1
                //   }
                // suffixIcon={<DownCircleTwoTone />}
                bordered={false}
                // dropdownStyle={{ color: 'green' }}
                // dropdownRender={menu => (
                //     <>
                //         <div>HELLO?</div>
                //         {menu}
                //         <Divider style={{ margin: '8px 0' }} />
                //         <Space align="center" style={{ padding: '0 8px 4px' }}>
                //             <Input placeholder="Please enter item" value={name} onChange={logger} />
                //             <Typography.Link onClick={logger} style={{ whiteSpace: 'nowrap' }}>
                //                 Add item
                //             </Typography.Link>
                //         </Space>
                //     </>
                // )}
                style={styles3.content} onChange={onChange}>
                <OptGroup label="Collections"
                // className={s["ant-select-item-group"]}
                // style={s["ant-select-item-group"]}
                // style = {styles3.optgroup}
                // style={styles2.ant-select-dropdown-menu-item-group-title}
                >
                    {NFTCollections &&
                        NFTCollections.map((collection, i) =>

                            <Option style={{ width: 1000, color: "black", paddingLeft: "12px" }} value={"-" + collection.addrs} key={i}>
                                <Avatar
                                    src={
                                        <Image
                                            src={collection.image}
                                            style={{
                                                width: 32,

                                            }}
                                        />
                                    }
                                    style={{

                                        backgroundColor: '#87d068',
                                    }}
                                    icon={<UserOutlined />}
                                />
                                <span className='pl-2'></span>
                                {/* <span className='pl-2'>
                                        {collection.name}
                                    </span> */}
                                {collection.name}
                                {/* <Avatar
                                    src={
                                        <Image
                                            src={collection.image}
                                            style={{
                                                width: 32,
                                            }}
                                        />
                                    }
                                    style={{

                                        backgroundColor: '#87d068',
                                    }}
                                    icon={<UserOutlined />}
                                /> */}
                                {/* <span className='pl-2'> */}
                                {/* {collection.name} */}
                                {/* </span> */}
                            </Option>
                        )
                    }
                </OptGroup>
                <OptGroup label="Accounts">
                    {users &&
                        users.slice(1, users.length).map((user, i2) =>
                            <Option style={{ width: 1000, color: "black", paddingLeft: "12px" }} value={user.get("ethAddress")} key={(i2 * -1) - 1}>

                                <span>
                                    {user.get("brand_image") != null ? 
                                                                <Avatar
                                                                style={{
                            
                                                                    backgroundColor: '#87d068',
                                                                }}
                            
                                                                src={
                                                                    <Image
                                                                        src={user.get("brand_image")}
                                                                    />
                                                                }
                            
                                                                icon={<UserOutlined />}
                                                            /> : 
                                                            
                                                            <Avatar
                                                                style={{
                            
                                                                    backgroundColor: '#87d068',
                                                                }}
                                                                icon={<UserOutlined />}
                                                            />
                                
                                
                                }

                                </span>

                                {/* <Avatar
                                    style={{

                                        backgroundColor: '#87d068',
                                    }}

                                    src={
                                        <Image
                                            src={user.get("brand_image") != null ? user.get("brand_image") : ""}
                                        />
                                    }

                                    icon={<UserOutlined />}
                                /> */}

                                <span className='pl-2'>
                                </span>
                                {user.get("ethAddress")}
                            </Option>
                        )
                    }
                </OptGroup>
                {/* <OptGroup label="Accounts">
                    {users &&
                        users.slice(1, users.length).map((user, i2) =>
                            <Option style={{ width: 1000, color: "black", paddingLeft: "12px" }} value={user.get("ethAddress")} key={(i2 * -1) - 1}>
                                {user.get("ethAddress")}
                            </Option>
                        )
                    }
                </OptGroup> */}
            </Select>
            {/* <Select
                showSearch
                style={{ width: 1000 }}
                placeholder="Search to Select"
                optionFilterProp="children"
                filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                filterSort={(optionA, optionB) =>
                    optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                }
            >
                <Option value="1">Not Identified</Option>
                <Option value="2">Closed</Option>
                <Option value="3">Communicated</Option>
                <Option value="4">Identified</Option>
                <Option value="5">Resolved</Option>
                <Option value="6">Cancelled</Option>
            </Select> */}
            {/* <Select
                showSearch
                placeholder="Search for Collections and Accounts"
                optionFilterProp="children"
                suffixIcon={<DownCircleTwoTone />}
                bordered={false}
                // dropdownStyle={{ color: 'green' }}
                // dropdownRender={menu => (
                //     <>
                //         <div>HELLO?</div>
                //         {menu}
                //         <Divider style={{ margin: '8px 0' }} />
                //         <Space align="center" style={{ padding: '0 8px 4px' }}>
                //             <Input placeholder="Please enter item" value={name} onChange={logger} />
                //             <Typography.Link onClick={logger} style={{ whiteSpace: 'nowrap' }}>
                //                 Add item
                //             </Typography.Link>
                //         </Space>
                //     </>
                // )}

                style={styles3.content} onChange={onChange}>
                <OptGroup label="Collections"
                // className={s["ant-select-item-group"]}
                // style={s["ant-select-item-group"]}
                // style = {styles3.optgroup}
                // style={styles2.ant-select-dropdown-menu-item-group-title}
                >
                    {NFTCollections &&
                        NFTCollections.map((collection, i) =>
                            <Option style={{ width: 1000, color: "black", paddingLeft: "12px" }} value={"-" + collection.addrs} key={i}>
                                <Avatar
                                    src={
                                        <Image
                                            src= {collection.image}
                                            style={{
                                                width: 32,
                                            }}
                                        />
                                    }
                                    style={{

                                        backgroundColor: '#87d068',
                                    }}
                                    icon={<UserOutlined />}
                                />

                                <span className='pl-2'>
                                    {collection.name}
                                </span>
                            </Option>
                        )
                    }
                </OptGroup>
                <OptGroup label="Accounts">
                    {users &&
                        users.slice(1, users.length).map((user, i2) =>
                            <Option style={{ width: 1000, color: "black", paddingLeft: "12px" }} value={user.get("ethAddress")} key={(i2 * -1) - 1}>
                                <Avatar
                                    style={{

                                        backgroundColor: '#87d068',
                                    }}
                                    icon={<UserOutlined />}
                                />

                                <span className='pl-2'>
                                    {user.get("ethAddress")}
                                </span>

                            </Option>
                        )
                    }
                </OptGroup>
            </Select> */}


        </>

    )
}
export default SearchCollections;