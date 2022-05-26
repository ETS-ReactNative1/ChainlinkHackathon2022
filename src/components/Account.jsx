import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { useMoralis } from "react-moralis";
import { getEllipsisTxt } from "helpers/formatters";
import Blockie from "./Blockie";
import { Button, Card, Modal } from "antd";
import { useState } from "react";
import Address from "./Address/Address";
import { SelectOutlined } from "@ant-design/icons";
import { getExplorer } from "helpers/networks";
const styles = {
  account: {
    height: "42px",
    padding: "0 15px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "fit-content",
    borderRadius: "12px",
    backgroundColor: "rgb(244, 244, 244)",
    cursor: "pointer",
  },
  text: {
    color: "#21BF96",
  },
};

function Account() {
  const { authenticate, isAuthenticated, logout } = useMoralis();
  const { walletAddress, chainId } = useMoralisDapp();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isWalletModalVisible, setisWalletModalVisible] = useState(false);




  function auth() {
    //authenticate({ signingMessage: "Connect your wallet to start using CouponMint!" }).then(function (res) {
    //
    //  console.log("res:", res)
    //})
    var ret = authenticate({
      signingMessage: "Connect your wallet to start using CouponMint!",
      onError: () => goldenShow()
    }
    // var ret = authenticate({
    //   signingMessage: "Connect your wallet to start using CouponMint!", onSuccess: () => alert("🎉"),
    //   onError: () => goldenShow()
    // }

    )
    console.log("authenticate returned:", ret)
  }

  function goldenShow() {
    //alert("GOLDEN ERROR🎉")
    setisWalletModalVisible('true')
  }

  const openInNewTab = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  }

  async function web3_login() {
    await authenticate({
      provider: "web3Auth",
      clientId: "BGy3sUktwdhE-sAjtbzH6olEX5j2ita7GvSrI832oX-UrUHyZzi_KitsmKRd2VVfxKLvJWLb2MCwQM5HZyQqJJ8",
      onSuccess: () => alert("🎉"),
      onError: (e) => alert("disgusting error:",e),
    })

  }



  if (!isAuthenticated) {
    //alert("HELLO")
    return (
      <div className="div">
        <div
          style={styles.account}
          //onClick={() => authenticate({ signingMessage: "Connect your wallet to start using CouponMint!" })}
          onClick={auth}
        >
          <p style={styles.text}>Authenticate</p>
        </div>

        <Modal
          visible={isWalletModalVisible}
          footer={null}
          onCancel={() => setisWalletModalVisible(false)}
          bodyStyle={{
            padding: "15px",
            fontSize: "17px",
            fontWeight: "500",
          }}
          style={{ fontSize: "16px", fontWeight: "500" }}
          width="400px"
        >
          Connect Wallet

          <Button
            size="large"
            type="primary"
            style={{
              
              width: "100%",
              marginTop: "35px",
              borderRadius: "0.5rem",
              fontSize: "16px",
              fontWeight: "500",
            }}
            onClick={() => {
              //logout();
              web3_login()
              //openInNewTab('https://metamask.io/download/')
              //setisWalletModalVisible(false);
            }}
          >
            Login with Web3Auth
          </Button>

          <Button
            size="large"
            type="primary"
            style={{
              
              width: "100%",
              marginTop: "35px",
              borderRadius: "0.5rem",
              fontSize: "16px",
              fontWeight: "500",
            }}
            onClick={() => {
              //logout();
              openInNewTab('https://metamask.io/download/')
              //setisWalletModalVisible(false);
            }}
          >
            MetaMask
          </Button>
          

        </Modal>



      </div>
    );
  }

  return (
    <>
      <div style={styles.account} onClick={() => setIsModalVisible(true)}>
        <p style={{ marginRight: "5px", ...styles.text }}>
          {getEllipsisTxt(walletAddress, 6)}
        </p>
        <Blockie currentWallet scale={3} />
      </div>
      <Modal
        visible={isModalVisible}
        footer={null}
        onCancel={() => setIsModalVisible(false)}
        bodyStyle={{
          padding: "15px",
          fontSize: "17px",
          fontWeight: "500",
        }}
        style={{ fontSize: "16px", fontWeight: "500" }}
        width="400px"
      >
        Account
        <Card
          style={{
            marginTop: "10px",
            borderRadius: "1rem",
          }}
          bodyStyle={{ padding: "15px" }}
        >
          <Address
            avatar="left"
            size={6}
            copyable
            style={{ fontSize: "20px" }}
          />
          <div style={{ marginTop: "10px", padding: "0 10px" }}>
            <a
              href={`${getExplorer(chainId)}/address/${walletAddress}`}
              target="_blank"
              rel="noreferrer"
            >
              <SelectOutlined style={{ marginRight: "5px" }} />
              View on Explorer
            </a>
          </div>
        </Card>
        <Button
          size="large"
          type="primary"
          style={{
            width: "100%",
            marginTop: "10px",
            borderRadius: "0.5rem",
            fontSize: "16px",
            fontWeight: "500",
          }}
          onClick={() => {
            logout();
            setIsModalVisible(false);
          }}
        >
          Disconnect Wallet
        </Button>
      </Modal>
    </>
  );
}

export default Account;
