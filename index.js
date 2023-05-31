import "regenerator-runtime/runtime";
import { ethers } from "ethers";
import { parseUnits, hexlify } from "ethers/lib/utils";

let provider;
let signer;

document.addEventListener("DOMContentLoaded", loadApp());

const desiredNetworks = [
	{
        chainId: '0x38',
        chainName: 'Binance Smart Chain Mainnet',
        nativeCurrency: {
            name: 'BNB',
            symbol: 'BNB',
            decimals: 18
        },
        rpcUrls: ['https://bsc-dataseed.binance.org/'],
        blockExplorerUrls: ['https://bscscan.com']
    },
    {
        chainId: '0x61',
        chainName: 'Binance Smart Chain Testnet',
        nativeCurrency: {
            name: 'BNB',
            symbol: 'BNB',
            decimals: 18
        },
        rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
        blockExplorerUrls: ['https://testnet.bscscan.com']
    },
    {
        chainId: '0x89',
        chainName: 'Polygon Mainnet',
        nativeCurrency: {
            name: 'MATIC',
            symbol: 'MATIC',
            decimals: 18
        },
        rpcUrls: ['https://polygon-rpc.com/'],
        blockExplorerUrls: ['https://polygonscan.com/']
    },
    {
        chainId: '0x4E454153',
        chainName: 'Aurora Testnet',
        nativeCurrency: {
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18
        },
        rpcUrls: ['https://testnet.aurora.dev'],
        blockExplorerUrls: ['https://testnet.aurorascan.dev']
    },
    {
        chainId: '0x4E454152',
        chainName: 'Aurora Mainnet',
        nativeCurrency: {
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18
        },
        rpcUrls: ['https://mainnet.aurora.dev'],
        blockExplorerUrls: ['https://explorer.aurora.dev/']
    },
    {
        chainId: '0x8AD',
        chainName: 'Kava EVM Testnet',
        nativeCurrency: {
            name: 'KAVA',
            symbol: 'KAVA',
            decimals: 18
        },
        rpcUrls: ['https://evm.evm-alpha.kava.io'],
        blockExplorerUrls: ['https://explorer.evm-alpha.kava.io']
    },
    {
        chainId: '0x8AE',
        chainName: 'Kava EVM',
        nativeCurrency: {
            name: 'KAVA',
            symbol: 'KAVA',
            decimals: 18
        },
        rpcUrls: ['https://evm.kava.io'],
        blockExplorerUrls: ['https://explorer.kava.io']
    },
    {
        chainId: '0x3E9',
        chainName: 'Klaytn Baobab',
        nativeCurrency: {
            name: 'KLAY',
            symbol: 'KLAY',
            decimals: 18
        },
        rpcUrls: ['https://api.baobab.klaytn.net:8651'],
        blockExplorerUrls: ['https://baobab.scope.klaytn.com/']
    },
    {
        chainId: '0x4',
        chainName: 'Rinkeby Test Network',
        nativeCurrency: {
            name: 'RinkebyETH',
            symbol: 'RinkebyETH',
            decimals: 18
        },
        rpcUrls: ['https://rinkeby.infura.io/v3/'],
        blockExplorerUrls: ['https://rinkeby.etherscan.io/']
    },
    {
        chainId: '0x12',
        chainName: 'ThunderCore Test Network',
        nativeCurrency: {
            name: 'TST',
            symbol: 'TST',
            decimals: 18
        },
        rpcUrls: ['https://testnet-rpc.thundercore.com'],
        blockExplorerUrls: ['https://explorer-testnet.thundercore.com']
    },
    {
        chainId: '0x3CC3',
        chainName: 'Trust Tesnet',
        nativeCurrency: {
            name: 'EVM',
            symbol: 'EVM',
            decimals: 18
        },
        rpcUrls: ['https://api.testnet-dev.trust.one'],
        blockExplorerUrls: ['https://trustscan.one']
    },
    {
        chainId: '0x2328',
        chainName: 'Evmos Testnet',
        nativeCurrency: {
            name: 'tEVMOS',
            symbol: 'tEVMOS',
            decimals: 18
        },
        rpcUrls: ['https://eth.bd.evmos.dev:8545'],
        blockExplorerUrls: ['https://evm.evmos.dev']
    },
    {
        chainId: '0x501',
        chainName: 'Octopus Testnet',
        nativeCurrency: {
            name: 'EBAR',
            symbol: 'EBAR',
            decimals: 18
        },
        rpcUrls: ['https://gateway.testnet.octopus.network/barnacle-evm/wj1hhcverunusc35jifki19otd4od1n5'],
        blockExplorerUrls: ['https://explorer.testnet.oct.network/barnacle-evm']
    },
    {
        chainId: '0x405',
        chainName: 'BitTorrent Chain Donau',
        nativeCurrency: {
            name: 'BTT',
            symbol: 'BTT',
            decimals: 18
        },
        rpcUrls: ['https://pre-rpc.bt.io/'],
        blockExplorerUrls: ['https://testscan.bt.io/']
    },
    {
        chainId: '0xC365',
        chainName: 'GTON Testnet',
        nativeCurrency: {
            name: 'GCD',
            symbol: 'GCD',
            decimals: 18
        },
        rpcUrls: ['https://testnet.gton.network/'],
        blockExplorerUrls: ['https://explorer.testnet.gton.network/']
    },
    {
        chainId: '0x56CDCC91',
        chainName: 'Concordium Testnet',
        nativeCurrency: {
            name: 'CCD',
            symbol: 'CCD',
            decimals: 18
        },
        rpcUrls: [''],
        blockExplorerUrls: ['']
    },
    {
        chainId: '0x56CDCC96',
        chainName: 'Concordium Mainnet',
        nativeCurrency: {
            name: 'CCD',
            symbol: 'CCD',
            decimals: 18
        },
        rpcUrls: [''],
        blockExplorerUrls: ['']
    }
];

async function loadApp() {
  provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  signer = provider.getSigner();
  if (!signer) window.location.reload();
  await provider.send("eth_requestAccounts", []);
  processAction();
}

async function processAction() {
  const urlParams = new URLSearchParams(window.location.search);
  const action = urlParams.get("action");
  const message = urlParams.get("message");
  const chainId = urlParams.get("chainId") || 1;
  const to = urlParams.get("to");
  const value = urlParams.get("value");
  const data = urlParams.get("data") || "";
  const gasLimit = urlParams.get("gasLimit") || undefined;
  const gasPrice = urlParams.get("gasPrice") || undefined;

  if (action === "sign" && message) {
    return signMessage(message);
  }

  if (action === "send" && to && value) {
    return sendTransaction(chainId, to, value, gasLimit, gasPrice, data);
  }

  displayResponse("Invalid URL");
}

async function sendTransaction(chainId, to, value, gasLimit, gasPrice, data) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    let network = await provider.getNetwork();

    console.log(chainId);
    while (network.chainId != chainId) {
	    try{
	    	await window.ethereum.request({
		        	method: "wallet_switchEthereumChain",
		        params: [{ chainId: `0x${parseInt(chainId, 10).toString(16)}` }], // chainId must be in hexadecimal numbers
		    });
		    network = await provider.getNetwork();
	    } catch (switchError) {
			try {
				await handleChainId(chainId, network)
			} catch {
				copyToClipboard("error");
				return;
			}
    	}
    	console.log(network.chainId);
    	await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const from = await signer.getAddress();
    const tx = await signer.sendTransaction({
      from,
      to,
      value: parseUnits(value, "wei"),
      gasLimit: gasLimit ? hexlify(Number(gasLimit)) : gasLimit,
      gasPrice: gasPrice ? hexlify(Number(gasPrice)) : gasPrice,
      data: data ? data : "0x",
    });
    console.log({ tx });
    displayResponse("Transaction sent.<br><br>Copy to clipboard then continue to App", tx.hash);
  } catch (error) {
  	displayResponse("Transaction Denied");
    copyToClipboard("error");
  }
}

async function signMessage(message) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const signature = await signer.signMessage(message);
    console.log({ signature });
    displayResponse("Signature complete.<br><br>Copy to clipboard then continue to App", signature);
  } catch (error) {
  	displayResponse("Signature Denied");
    copyToClipboard("error");

  }
}

async function copyToClipboard(response) {
  try {
  	const deepLinkUrl = "motodex://?response="+response;

    // focus from metamask back to browser
    window.focus();
    // wait to finish focus
    await new Promise((resolve) => setTimeout(resolve, 500));

    executeDeepLink(deepLinkUrl);

    // copy tx hash to clipboard
    await navigator.clipboard.writeText(response);
    document.getElementById("response-button").innerHTML = "Copied";
  } catch {
    // for metamask mobile android
    const input = document.createElement("input");
    input.type = "text";
    input.value = response;
    document.body.appendChild(input);
    input.select();
    document.execCommand("Copy");
    input.style = "visibility: hidden";
    document.getElementById("response-button").innerHTML = "Copied";
  }
}

function displayResponse(text, response) {
  // display error or response
  const responseText = document.getElementById("response-text");
  responseText.innerHTML = text;
  responseText.className = "active";

  if (response) {
    // display button to copy tx.hash or signature
    const responseButton = document.getElementById("response-button");
    responseButton.className = "active";
    responseButton.onclick = () => copyToClipboard(response);
  }
}

async function addNetworkToMetamask(network) {
  try {
    // Add the required chain to Metamask
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [network],
    });
  } catch (error) {
    console.error("Failed to add the required chain to Metamask:", error);
    throw new Error("Failed to add the required chain to Metamask");
  }
}

function executeDeepLink(url) {
  // Use the appropriate method to execute the deep link based on the platform
  
  // For Android
  if (navigator.userAgent.match(/Android/i)) {
    window.open(url);
  }
  
  // For iOS
  if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
    window.location.replace(url);
  }
}

async function handleChainId(chainId, network) {
	const chainIdHex = "0x" + parseInt(chainId, 10).toString(16);
	console.log(chainIdHex);
	console.log(network.chainId);
    const requiredNetwork = desiredNetworks.find((network) => network.chainId.toLowerCase() === chainIdHex.toLowerCase());

	if (requiredNetwork) {
	  try {
	    await addNetworkToMetamask(requiredNetwork);
	  } catch (error) {
	    console.error("Failed to add the required chain to Metamask:", error);
	    displayResponse("Failed to add the required chain to Metamask");
	    throw new Error('Failed to add the required chain to Metamask');
	  }
	} else {
	  displayResponse("Network not supported for adding!");
	  throw new Error('Network not supported for adding!');
	}
  
}