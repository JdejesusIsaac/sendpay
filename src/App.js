import { useState } from "react";
import { ethers } from "ethers"; // how we contact eth net. if we wnt to sign, send, transaction or interact with smartcontract
import ErrorMessage from "./ErrorMessage";
import TxList from "./TxList";

const startPayment = async ({ setError, setTxs, ether, addr }) => {
  //if there is no metamask present throw error
  try {
    if (!window.ethereum)
      throw new Error("No crypto wallet found. Please install it.");
      // no we ask user for permission to use metamask. await is or trigger 

    await window.ethereum.send("eth_requestAccounts");
    // we get provider using ethers package.
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // then we establish we signer is
    const signer = provider.getSigner();
    //validate address. throws error if address is wrong
    ethers.utils.getAddress(addr);
    //after we have signer we establish a transaction
    const tx = await signer.sendTransaction({
      to: addr,
      value: ethers.utils.parseEther(ether)
    });
    console.log({ ether, addr });
    console.log("tx", tx);
    setTxs([tx]);
  } catch (err) {
    setError(err.message);
  }
};

export default function App() {
  const [error, setError] = useState();
  const [txs, setTxs] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    setError();
    await startPayment({
      setError,
      setTxs,
      ether: data.get("ether"),
      addr: data.get("addr")
    });
  };

  return (
    <form className="m-4" onSubmit={handleSubmit}>
      <div className="credit-card w-full lg:w-1/2 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
        <main className="mt-4 p-4">
          <h1 className="text-xl font-semibold text-gray-700 text-center">
            Send ETH payment
          </h1>
          <div className="">
            <div className="my-3">
              <input
                type="text"
                name="addr"
                className="input input-bordered block w-full focus:ring focus:outline-none"
                placeholder="Recipient Address"
              />
            </div>
            <div className="my-3">
              <input
                name="ether"
                type="text"
                className="input input-bordered block w-full focus:ring focus:outline-none"
                placeholder="Amount in ETH"
              />
            </div>
          </div>
        </main>
        <footer className="p-4">
          <button
            type="submit"
            className="btn btn-primary submit-button focus:ring focus:outline-none w-full"
          >
            Pay now
          </button>
          <ErrorMessage message={error} />
          <TxList txs={txs} />
        </footer>
      </div>
    </form>
  );
}