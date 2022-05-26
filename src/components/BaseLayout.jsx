import React from "react";
import { Menu, Layout } from "antd";
import Text from "antd/lib/typography/Text";

import Account from "./Account";
import Chains from "./Chains";

import logo from '../images/logo.png'; // with import
import Image from 'next/image';

import "antd/dist/antd.css";
import "../styles/style.module.css";

import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";

import { useRouter } from 'next/router'
import SearchCollections from "./SearchCollections";
import Router from 'next/router'
import Link from 'next/link'

const { Header, Footer } = Layout;

const styles = {
  content: {
    display: "flex",
    justifyContent: "center",
    fontFamily: "Roboto, sans-serif",
    color: "#041836",
    marginTop: "130px",
    padding: "10px",

  },
  contentlessmargin: {
    display: "flex",
    justifyContent: "center",
    fontFamily: "Roboto, sans-serif",
    color: "#041836",
    marginTop: "30px",
    padding: "10px",
    paddingRight: "100px",

  },
  contentnomargin: {
    display: "flex",
    justifyContent: "center",
    fontFamily: "Roboto, sans-serif",
    color: "#041836",
    padding: "10px",

  },
  header: {
    position: "fixed",
    zIndex: 1,
    width: "100%",
    background: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontFamily: "Roboto, sans-serif",
    borderBottom: "2px solid rgba(0, 0, 0, 0.06)",
    padding: "0 10px",
    boxShadow: "0 1px 10px rgb(151 164 175 / 10%)",
    height: "80px"
  },
  headerRight: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    fontSize: "15px",
    fontWeight: "600",
  },
  wrapper: {
  }
};
function onChange(value) {
  Router.push({
    pathname: '/nftmarketplace',
    query: { id: value },
  })
}

function Basediv({ children }) {
  const { Moralis, isWeb3Enabled, enableWeb3, isAuthenticated, isWeb3EnableLoading } =
    useMoralis();
  const [inputValue, setInputValue] = useState("explore");
  const [UserType, setUserType] = useState("explore");
  const [loading, setLoading] = useState("loading");
  const router = useRouter();
  const [dimension, setDimension] = useState([
    1024, 728,
  ]);
  //const router = useLocation()
  const nftmarkeplaceurlchecker = new Set(["/nftbalance", "/nftmarketplace", "/restaurantverification", "/transactions", "/createpass", "/collectioncreation", "/profile", "/editprofile", "/created", "/bought", "/analytics", "/gallery"])
  const homepageurlchecker = new Set(["/home", "/contact", "/faq", "/about", "/demo"])

  useEffect(() => {
    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading) {
      enableWeb3();
      request()
    }

  }, [isAuthenticated, isWeb3Enabled]);

  //This queries the moralis database to get the current user type
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
          setLoading("loaded")
        } else {
          setUserType("client")
          setLoading("loaded")
        }
      }, (error) => {
        // The object was not retrieved successfully.
        // error is a Moralis.Error with an error code and message.
      });
    }
    catch (e) {
    }

  }


  if ((!isAuthenticated || loading == "loading")) {

    return (
      <div style={styles.wrapper}>
        {!(homepageurlchecker.has(router.pathname)) &&
          <div className="w-full bg-white" style={{ overflow: "auto" }}>
            <Header style={styles.header}>
              <div
                className="h-12"
              >
                <Link href="/home">
                  <a>
                    <Image
                      width="300"
                      height="50"
                      src={logo} />
                  </a>
                </Link>
              </div>
              <SearchCollections setInputValue={setInputValue} />

              <Menu
                theme="light"
                mode="horizontal"
                style={{
                  display: "flex",
                  fontSize: "17px",
                  fontWeight: "500",
                  marginLeft: "50px",
                  width: "25%",
                }}
                defaultSelectedKeys={["NFTMarketPlace"]}
              >
                <Menu.Item key="nftMarket" onClick={() => onChange("explore")} >
                  🛒 Explore Market

                </Menu.Item>
                <Menu.Item key="RestaurantVerification">
                  <Link href="/restaurantverification">
                    <a>✔️ Restaurant Verification</a>
                  </Link>
                </Menu.Item>

                <Menu.Item key="Login">
                  <Link href="/login">
                    <a>✔️ Login</a>
                  </Link>
                </Menu.Item>

                <Menu.Item key="profilequery">
                  <Link href="/profilequery">
                    <a>✔️ ProfileQuery</a>
                  </Link>
                </Menu.Item>

                <Menu.Item key="searchcollections">
                  <Link href="/searchcollections">
                    <a>✔️ Collections Search Helper</a>
                  </Link>
                </Menu.Item>

              </Menu>
              <div style={styles.headerRight}>
                <Chains />
                {/* <NativeBalance /> */}
                <Account />
              </div>
            </Header>

          </div>
        }

        {homepageurlchecker.has(router.pathname) &&
          <div className="w-screen bg-white" style={{ overflow: "auto" }}>

            <section className="h-20 w-full">

              <div
                className="w-full container mx-auto flex  items-center justify-between h-20"
              >
                <div
                  className="h-12"
                  id="nav-content"
                >
                  <Link href="/home">
                    <a>
                      <Image
                        width="300"
                        height="50"
                        src={logo} />
                    </a>
                  </Link>
                </div>
                <div className="text-left px-1 md:px-0 object-contain h-40 w-6/12 m-px mr-4 float-right">
                  <button className="  bg-transparent  text-gray-700 font-semibold hover:text-blue-400 mt-16  rounded  w-2/12 float-right">
                    <Link href="/contact">
                      <a>Contact Us</a>
                    </Link>
                  </button>
                  <button className="  bg-transparent  text-gray-700 font-semibold hover:text-blue-400  mt-16  mr-2 rounded  w-2/12 float-right">
                    <Link href="/faq">
                      <a>FAQ</a>
                    </Link>

                  </button>
                  <button className="  bg-transparent  text-gray-700 font-semibold hover:text-blue-400  mt-16 ml-3  rounded  w-2/12 float-right">
                    <Link href="/about">
                      <a>About</a>
                    </Link>
                  </button>
                  <button className="  bg-transparent  text-gray-700 font-semibold hover:text-blue-400  mt-16   mr-1   rounded  w-2/12 float-right" onClick={() => onChange("explore")}>
                    Marketplace
                  </button>
                </div>
              </div>
            </section>

          </div>

        }

        {!(homepageurlchecker.has(router.pathname)) &&
          <div style={styles.content}>{children}</div>

        }
        {homepageurlchecker.has(router.pathname) &&
          <div style={styles.contentlessmargin}>{children}</div>
        }

      </div>

    );

  }
  else if (isAuthenticated && UserType == "restaurant") {

    return (
      <div style={styles.wrapper}>

        {!(homepageurlchecker.has(router.pathname)) &&
          <div className="w-full bg-white" style={{ overflow: "auto" }}>
            <Header style={styles.header}>
              <div
                className="h-12"
              >
                <Link href="/home">
                  <a>
                    <Image
                      width="300"
                      height="50"
                      src={logo} />
                  </a>
                </Link>
              </div>



              <SearchCollections setInputValue={setInputValue} />

              <Menu
                theme="light"
                mode="horizontal"
                style={{
                  display: "flex",
                  fontSize: "17px",
                  fontWeight: "500",
                  marginLeft: "50px",
                  width: "25%",
                }}
              >

                <Menu.Item key="nftMarket" onClick={() => onChange("explore")} >
                  🛒 Explore Market
                </Menu.Item>
                
                <Menu.Item key="Collection Creation">
                  <Link href="/collectioncreation">
                    <a>📑 CC</a>
                  </Link>
                </Menu.Item>
                <Menu.Item key="nftmint">
                  <Link href="/createpass">

                    <a>🖼 Create NFT</a>
                  </Link>

                </Menu.Item>
                <Menu.Item key="Profile">
                  <Link href="/profile">

                    <a>📑 Your Profile</a>
                  </Link>

                </Menu.Item>
                <Menu.Item key="EditProfile">
                  <Link href="/editprofile">

                    <a>✏️ Edit Profile</a>
                  </Link>

                </Menu.Item>
                <Menu.Item key="analytics">
                  <Link href="/analytics">

                    <a>📈 Collection Analytics</a>
                  </Link>

                </Menu.Item>
              </Menu>
              <div style={styles.headerRight}>
                <Chains />
                {/* <NativeBalance /> */}
                <Account />
              </div>
            </Header>

          </div>
        }

        {homepageurlchecker.has(router.pathname) &&
          <div className="w-screen bg-white" style={{ overflow: "auto" }}>

            <section className="h-20 bg-white w-full">

              <div
                className="w-full container mx-auto flex  items-center justify-between h-20"
              >
                <div
                  className="h-12"
                >
                  <Link href="/home">
                    <a>
                      <Image
                        width="300"
                        height="50"
                        src={logo} />
                    </a>
                  </Link>
                </div>
                <div className="text-left px-1 md:px-0 object-contain h-40 w-6/12 m-px mr-4 float-right">
                  <button className="  bg-transparent  text-gray-700 font-semibold hover:text-blue-400 mt-16  rounded  w-2/12 float-right">
                    <Link href="/contact">
                      <a>Contact Us</a>
                    </Link>
                  </button>
                  <button className="  bg-transparent  text-gray-700 font-semibold hover:text-blue-400  mt-16  mr-2 rounded  w-2/12 float-right">
                    <Link href="/faq">
                      <a>FAQ</a>
                    </Link>

                  </button>
                  <button className="  bg-transparent  text-gray-700 font-semibold hover:text-blue-400  mt-16 ml-3  rounded  w-2/12 float-right">
                    <Link href="/about">
                      <a>About</a>
                    </Link>
                  </button>
                  <button className="  bg-transparent  text-gray-700 font-semibold hover:text-blue-400  mt-16   mr-1   rounded  w-2/12 float-right" onClick={() => onChange("explore")}>
                    Marketplace
                  </button>
                </div>

              </div>
            </section>


          </div>

        }
        {!(homepageurlchecker.has(router.pathname)) &&
          <div style={styles.content}>{children}</div>

        }
        {homepageurlchecker.has(router.pathname) &&
          <div style={styles.contentlessmargin}>{children}</div>
        }

      </div>
    );
  }
  else if (isAuthenticated && UserType == "client") {
    return (

      <div style={styles.wrapper}>
        {!(homepageurlchecker.has(router.pathname)) &&
          <div className="w-full bg-white" style={{ overflow: "auto" }}>
            <Header style={styles.header}>
              <div
                className="h-12"
              >
                <Link href="/home">
                  <a>
                    <Image
                      width="300"
                      height="50"
                      src={logo} />
                  </a>
                </Link>
              </div>


              <SearchCollections setInputValue={setInputValue} />
              <Menu
                theme="light"
                mode="horizontal"
                style={{
                  display: "flex",
                  fontSize: "17px",
                  fontWeight: "500",
                  marginLeft: "50px",
                  width: "25%",
                }}
              >
                <Menu.Item key="nftMarket" onClick={() => onChange("explore")} >
                  🛒 Explore Market

                </Menu.Item>
                <Menu.Item key="Profile">
                  <Link href="/profile">

                    <a>📑 Your Profile</a>
                  </Link>

                </Menu.Item>
                <Menu.Item key="EditProfile">
                  <Link href="/editprofile">

                    <a>✏️ Edit Profile</a>
                  </Link>

                </Menu.Item>
                <Menu.Item key="RestaurantVerification">
                  <Link href="/restaurantverification">

                    <a>✔️ Restaurant Verification</a>
                  </Link>

                </Menu.Item>
              </Menu>
              <div style={styles.headerRight}>
                <Chains />
                {/* <NativeBalance /> */}
                <Account />
              </div>
            </Header>

          </div>
        }

        {homepageurlchecker.has(router.pathname) &&
          <div className="w-screen bg-white" style={{ overflow: "auto" }}>

            <section className="h-20 bg-white w-full">

              <div
                className="w-full container mx-auto flex  items-center justify-between h-20"
              >
                <div
                  className="h-12"
                >
                  <Link href="/home">
                    <a>
                      <Image
                        width="300"
                        height="50"
                        src={logo} />
                    </a>
                  </Link>
                </div>
                <div className="text-left px-1 md:px-0 object-contain h-40 w-6/12 m-px mr-4 float-right">
                  <button className="  bg-transparent  text-gray-700 font-semibold hover:text-blue-400 mt-16  rounded  w-2/12 float-right">
                    <Link href="/contact">
                      <a>Contact Us</a>
                    </Link>
                  </button>
                  <button className="  bg-transparent  text-gray-700 font-semibold hover:text-blue-400  mt-16  mr-2 rounded  w-2/12 float-right">
                    <Link href="/faq">
                      <a>FAQ</a>
                    </Link>

                  </button>
                  <button className="  bg-transparent  text-gray-700 font-semibold hover:text-blue-400  mt-16 ml-3  rounded  w-2/12 float-right">
                    <Link href="/about">
                      <a>About</a>
                    </Link>
                  </button>
                  <button className="  bg-transparent  text-gray-700 font-semibold hover:text-blue-400  mt-16   mr-1   rounded  w-2/12 float-right" onClick={() => onChange("explore")}>
                    Marketplace
                  </button>
                </div>

              </div>
            </section>
          </div>

        }

        {!(homepageurlchecker.has(router.pathname)) &&
          <div style={styles.content}>{children}</div>

        }
        {homepageurlchecker.has(router.pathname) &&
          <div style={styles.contentlessmargin}>{children}</div>
        }
      </div>
    );
  }
  else {
    return (
      <div style={{ height: "100vh", overflow: "auto" }}>



        <div className="container">
          We should never reach this
        </div>



      </div>
    );
  }

}


export default Basediv;