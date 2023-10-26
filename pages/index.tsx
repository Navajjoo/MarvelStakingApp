import { ConnectWallet, useContract, useAddress, Web3Button, useOwnedNFTs, ThirdwebNftMedia } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const address = useAddress();

  const marvelAddress = "0xf37A3686800A9fb19625c05e1A7ACf2D232e8aa4";
  const lymAddress = "0x19A448F03fCb1d5c57369Bc1e440F11486aef5e2";

  const {contract: marvelContract } = useContract(marvelAddress, "nft-drop");
  const {contract: lymContract } = useContract(lymAddress);

  const {data: myMarvelNFTs} = useOwnedNFTs(marvelContract, address);

  async function stakeNFT(nftId: string) {
    if(!address) return;

    const isAppoved = await marvelContract?.isApproved(
      address,
      lymAddress
    );

    if (!isAppoved) {
      await marvelContract?.setApprovalForAll(lymAddress, true);
    }

    await lymContract?.call("stake", [nftId])
  }
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
                contractAddress={lymAddress}
                action={() => stakeNFT(nft.metadata.id)}
              >Stake Marvel</Web3Button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
