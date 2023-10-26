import { FC } from 'react';
import { ThirdwebNftMedia, useContract, useNFT, Web3Button } from '@thirdweb-dev/react';

interface NFTCardProps {
    tokenId: number;
}

const NFTCard: FC<NFTCardProps> = ({ tokenId}) => {
    const marvelAddress = "0xf37A3686800A9fb19625c05e1A7ACf2D232e8aa4";
    const lymAddress = "0x19A448F03fCb1d5c57369Bc1e440F11486aef5e2";
    
    const { contract: marvelContract } = useContract(marvelAddress, "nft-drop");
    const { contract: lymContract } = useContract(lymAddress);
    const { data: nft } = useNFT(marvelContract, tokenId);

    async function withdraw(nftId: string) {
        await lymContract?.call("withdraw", [nftId]);
    }

    return (
        <>
            {nft && (
                <div>
                    <h3>{nft.metadata.name}</h3>
                    {nft.metadata && (
                        <ThirdwebNftMedia
                            metadata={nft.metadata}
                        />
                    )}
                    <Web3Button     
                        contractAddress={lymAddress}
                        action={() => withdraw(nft.metadata.id)}
                    >Withdraw</Web3Button>
                </div>
            )}
        </>
    )
}
export default NFTCard;