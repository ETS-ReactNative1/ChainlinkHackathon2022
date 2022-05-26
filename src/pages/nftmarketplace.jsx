import NFTTokenIds from "../components/NFTTokenIds";
import React from "react";
import { useRouter } from "next/router";


function Nftmarketplace() {
	const Router = useRouter();
	return  <NFTTokenIds inputValue={Router.query.id}/>
	;
}

export default Nftmarketplace;
