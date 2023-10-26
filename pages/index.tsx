import {
  ConnectWallet,
  useContract,
  useAddress,
  Web3Button,
  useOwnedNFTs,
  ThirdwebNftMedia,
} from "@thirdweb-dev/react";
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const address = useAddress();

  const marvelAddress = "0xf37A3686800A9fb19625c05e1A7ACf2D232e8aa4";
  const lymAddress = "0x19A448F03fCb1d5c57369Bc1e440F11486aef5e2";

  const { contract: marvelContract } = useContract(marvelAddress, "nft-drop");
  const { contract: lymContract } = useContract(lymAddress);

  const { data: myMarvelNFTs, error: nftError } = useOwnedNFTs(marvelContract, address);

  async function stakeNFT(nftId: string) {
    if (!address || !marvelContract || !lymContract) {
      console.error("Invalid address or contracts.");
      return;
    }

    try {
      const isApproved = await marvelContract.isApproved(address, lymAddress);

      if (!isApproved) {
        await marvelContract.setApprovalForAll(lymAddress, true);
        console.log("Approval set for LYM contract.");
      }

      const result = await lymContract.call("stake", [nftId]);
      console.log("Stake result:", result);
    } catch (error) {
      console.error("Error while staking NFT:", error);
    }
  }

  console.log("Address:", address);
  console.log("My Marvel NFTs:", myMarvelNFTs);
  console.log("NFT Error:", nftError);

  if (!address) {
    return <div>Loading wallet...</div>;
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1>Milky Way Marvels</h1>
        <Web3Button
          contractAddress={marvelAddress}
          action={(marvelContract) => marvelContract.erc721.claim(1)}
        >
          Claim Milky Way Marvel
        </Web3Button>
        <br />
        <h1>My Milky Way Marvel:</h1>
        <div>
          {myMarvelNFTs ? (
            myMarvelNFTs.map((nft) => (
              <div key={nft.metadata.id}>
                <h3>{nft.metadata.name}</h3>
                <ThirdwebNftMedia metadata={nft.metadata} height="100px" width="100px" />
                <Web3Button contractAddress={lymAddress} action={() => stakeNFT(nft.metadata.id)}>
                  Stake Milky Way Marvel
                </Web3Button>
              </div>
            ))
          ) : (
            <div>Loading NFTs...</div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
