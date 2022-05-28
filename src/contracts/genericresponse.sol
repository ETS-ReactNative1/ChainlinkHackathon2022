pragma solidity ^0.6.0;

import "@chainlink/contracts/src/v0.6/ChainlinkClient.sol";

contract APIConsumer is ChainlinkClient {



event below20(uint _price);
event below30(uint _price);
event below40(uint _price);
event below50(uint _price);

uint256 public Price;

address private oracle;
bytes32 private jobId;
uint256 private fee;


constructor() public {
    setChainlinkToken(0x326C977E6efc84E512bB9C30f76E30c160eD06FB);
    oracle =  0xc8D925525CA8759812d0c299B90247917d4d4b7C;
    jobId = "bbf0badad29d49dc887504bacfbb905b";
    fee = 10 ** 16; // 0.01 LINK
    Price=0;
}

 
 
function requestBTCCNYPrice(string memory getURL,string memory path) public returns (bytes32 requestId) 
{
    Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
    
    // Set the URL to perform the GET request on
   request.add("get", getURL);
       

  //request.add("get", "  https://api.the-odds-api.com/v4/sports/basketball_nba/odds/?regions=us&oddsFormat=american&apiKey=a218e281dc52ddab7c880948776e7c0f&markets=spreads");
   // request.addStringArray("path", path);
    request.add("path", path); 


  // request.addInt("times", 10000000000);
    
    // Sends the request
    return sendChainlinkRequestTo(oracle, request, fee);
}
function returnodds() public returns (uint256 odds)
{
return Price;
}
 
/**
 * Receive the response in the form of uint256
 */ 
function fulfill(bytes32 _requestId, uint256 _price) public recordChainlinkFulfillment(_requestId)
{
    Price = _price;
}
}
