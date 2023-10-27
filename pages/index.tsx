import { ConnectWallet, useContract, useAddress, Web3Button, useOwnedNFTs, ThirdwebNftMedia, useContractRead } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { BigNumber } from "ethers";
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import NFTCard from "./components/NFTCard";
import { useEffect, useState } from "react";

const Home: NextPage = () => {
  const address = useAddress();

  const marvelAddress = "0xf37A3686800A9fb19625c05e1A7ACf2D232e8aa4";
  const stakingAddress = "0x19A448F03fCb1d5c57369Bc1e440F11486aef5e2";

  const {contract: marvelContract } = useContract(marvelAddress, "nft-drop");
  const {contract: stakingContract } = useContract(stakingAddress);

  const {data: myMarvelNFTs} = useOwnedNFTs(marvelContract, address);
  const { data: stakedMarvelNFTs } = useContractRead(stakingContract,"getStakeInfo", [address,]);

  async function stakedNFT(nftId: string | undefined) {
    if (!address || !nftId) return;
  
    const isApproved = await marvelContract?.isApproved(
      address,
      stakingAddress
    );
  
    if (!isApproved) {
      await marvelContract?.setApprovalForAll(stakingAddress, true);
    }
  
    await stakingContract?.call("stake", [nftId]);
  }  

  const [claimableRewards, setClaimableRewards] = useState<BigNumber>();

  useEffect(() => {
    if(!stakingContract || !address) return;

    async function loadClaimableRewards() {
      const stakeInfo = await stakingContract?.call("getStakeInfo", [address]);
      setClaimableRewards(stakeInfo[1]);
    }
    
    loadClaimableRewards();
  }, [address, stakingContract]);

  return (
    <div className={styles.container}>
      <main className={styles.main}> 
        <h1>Milky Way Marvels NFT</h1>
        <Web3Button
          contractAddress={marvelAddress}
          action={(marvelContract) => marvelContract.erc721.claim(1)}
        >Claim Marvel</Web3Button>
        <br />
        <h1>My Marvel:</h1>
        <div>
          {myMarvelNFTs?.map((nft) => (
            <div>
              <h3>{nft.metadata.name}</h3>
              <ThirdwebNftMedia
                metadata={nft.metadata}
                height="100px"
                width="100px"
              />
              <Web3Button
                contractAddress={stakingAddress}
                action={() => stakedNFT(nft.metadata.id)}
              >Stake Marvel</Web3Button>
            </div>
          ))}
        </div>
        <h1>Staked Marvel:</h1>
        <div>
          {stakedMarvelNFTs && stakedMarvelNFTs[0].map((stakedNFT: BigNumber) => (
            <div key={stakedNFT.toString()}>
              <NFTCard tokenId={stakedNFT.toNumber()} />
            </div>
          ) )}
        </div>
        <br />
        <h1>Claimable $RAVERSE: </h1>
        {!claimableRewards ? "Loading..." : ethers.utils.formatUnits(claimableRewards, 18)}
        <Web3Button
          contractAddress={stakingAddress}
          action={(lymContract) => lymContract.call("claimRewards")}
        >Claim $RAVERSE</Web3Button>
      </main>
    </div>
  );
};

export default Home;
