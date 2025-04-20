import React, { useState } from "react";
import { ethers } from "ethers";

const MintPage: React.FC = () => {
    const [minting, setMinting] = useState<boolean>(false);

    const mintNFT = async () => {
        setMinting(true);

        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
                "0xc4FEbC06ff857d8D34E11dF7f6d85B96ee90711A", // Replace with your deployed contract address
                ["function mint() public"], // ABI of the mint function
                signer
            );

            try {
                const tx = await contract.mint();
                await tx.wait();
                alert("NFT Minted!");
            } catch (error) {
                alert("Minting failed!");
            } finally {
                setMinting(false);
            }
        } else {
            alert("Please install MetaMask!");
            setMinting(false);
        }
    };

    return (
        <div>
            <h1>Mint Your Badge</h1>
            <button onClick={mintNFT} disabled={minting}>
                {minting ? "Minting..." : "Mint Badge"}
            </button>
        </div>
    );
};

export default MintPage;
