// MEZZOUR OMAR

import { savingContractConfig } from "./config.js"
let web3;
let savingContract;
const connectButton = document.getElementById("connectWallet");

const main = async () => {
    connectButton.addEventListener("click", async () => {
    if (window.ethereum == undefined)
        return alert("please install metamask or any other compatible ethereum provider")

    console.log("metamask or other providers are installed")
    try {
        await window.ethereum.request({ method:"eth_requestAccounts" })
        let myAddress = await getMyAddress()
        myAddressEle.innerText = myAddress

        web3 = new Web3(window.ethereum)
        savingContract = new web3.eth.Contract(savingContractConfig.ABI, savingContractConfig.address)

        const balanceWei = await web3.eth.getBalance(myAddress)
        const balanceEth = web3.utils.fromWei(balanceWei, 'ether')
        const balanceDiv = document.getElementById('balanceDiv')
        balanceDiv.innerText = `Balance: ${balanceEth} ETH`

        await loadInfo()
    }
    catch (e) {
        alert(e.message)
    }
    });
}

const getMyAddress = async () => {
    return (await window.ethereum.request({ method: "eth_accounts" }))[0]
}

const loadInfo = async() => {
    savingContract.methods.minimumDeposit().call()
        .then(data => {
            minDepositDiv.innerText = parseFloat(data) / (10 ** 18) + " ETH"
        }).catch(e => console.log(e))

    web3.eth.getBalance(savingContractConfig.address).then(data => {
        yourDepositDiv.innerText = parseFloat(data) /(10 ** 18) +" ETH"
        }).catch(e => console.log(e))
}

depositBtn.addEventListener("click", async () => {
    showLoading()
    savingContract.methods.deposit().send({
        from: await getMyAddress(),
        to: savingContractConfig.address,
        value: amountInput.value
    }).then(async receipt => {

        console.log(receipt)
        amountInput.value = ""
        await loadInfo()
    })
        .catch(e => {
            console.log(e)
        })
        .finally(() => hideLoading())
})

withdrawBtn.addEventListener("click", async () => {
    //showLoading()
    savingContract.methods.withdraw().send({
        from: await getMyAddress(),
        to: savingContractConfig.address
        
    }).then(receipt => {
        console.log(receipt)
        showLinkScan(receipt)
    })
        .catch(e => {
            console.log(e)
            showLinkScan(e)
        }).finally(() => hideLoading())
})
const showLinkScan = (data) => {
    let txHash = data.transactionHash
    let link = "https://sepolia.etherscan.io/tx/" + txHash
    withdrawBtn.nextElementSibling.classList.remove("hidden")
    withdrawBtn.nextElementSibling.children[0].setAttribute("href", link)
}

const hideLoading = () => {
    loading.classList.add("hidden")
}
const showLoading = () => {
    loading.classList.remove("hidden")
}

main()