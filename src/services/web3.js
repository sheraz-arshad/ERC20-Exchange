import Web3 from 'web3'

import config from '../config';

let web3
if (window.web3) {
    web3 = new Web3(window.web3.currentProvider)
    web3.eth.getAccounts((err, accounts) => {
        console.log("hereee");
        if(accounts.length == 0) {
            alert("Login to Metamask");
            window.location.reload();
        }
    });   
} else {
    alert("This Dapps works only with Coinbase Wallet Browser and Browsers with Metamask Extension. Please login to your Metamask if you are using browsers with Metamask Extension.")
    window.location.reload();
}

export default web3;