// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract NFT is ERC721URIStorage,Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address contractAddress;

    constructor(address marketplaceAddress, string memory PassName,string memory PassSymbol) ERC721(PassName, PassSymbol) {
        contractAddress = marketplaceAddress;
    }

    function createToken(string memory tokenURI) public returns (uint) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
      //  setApprovalForAll(contractAddress, true);
        return newItemId;
    }
     function createmultiToken(string memory tokenURI,uint256 times) public returns (uint[] memory ) {
        uint[] memory list_of_token_id = new uint[](times);
        for (uint i = 0; i < times; i++) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        list_of_token_id[i]=newItemId;
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
       // setApprovalForAll(contractAddress, true);
        }
        return list_of_token_id;
     }
    function createmultiTokenself(string memory tokenURI,uint256 times,address addresses,uint256 price) public payable returns (uint[] memory ) {
        require(msg.value == times*price, "Please submit the betting amount in order to mint the parlay");
        uint[] memory list_of_token_id = new uint[](times);
        payable(addresses).transfer(msg.value);
        for (uint i = 0; i < times; i++) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        list_of_token_id[i]=newItemId;
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
  
           // payable((owner(nftContract)).transfer(msg.value*idToMarketItem[itemId].royaltypercentage/100);
       // setApprovalForAll(contractAddress, true);
        }
        return list_of_token_id;
    }
    function airdrop(string memory tokenURI,address[] memory addresses) public returns (uint[] memory ) {
        uint[] memory list_of_token_id = new uint[](addresses.length);
        for (uint i = 0; i < addresses.length; i++) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        list_of_token_id[i]=newItemId;
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
     //   setApprovalForAll(contractAddress, true);
        safeTransferFrom(msg.sender,addresses[i],newItemId);
        }
        return list_of_token_id;
    }
     function isApprovedForAll(address owner, address operator)
    public
    view
    virtual
    override
    returns (bool)
{
    // preapproved marketplace
    return
        super.isApprovedForAll(owner, operator) ||
        operator == contractAddress;
}
}
