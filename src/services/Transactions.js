import BigNumber from 'bignumber.js';

import FUSD_Instance from './FUSD_Instance';
import ExchangeInstance from './Exchange_Instance';
import web3 from './web3';
import config from '../config'

export const approveTokens = async () => {
    const amount_to_approve = web3.utils.toHex(BigNumber(100000).multipliedBy(BigNumber(10).pow(18)));

    return new Promise((resolve, reject) => {
        web3.eth.getAccounts( async (err, accounts) => {
            if(err) {
                reject(err);
            }

            FUSD_Instance.methods.approve(config.address_Exchange, amount_to_approve).send({
                from: accounts[0]
            }).once("transactionHash", (txHash) => {
                resolve(txHash);
            }
            )
        })
    });
    
}

export const convertToETH = async (tokens) => {
    const amount_to_convert = web3.utils.toHex(BigNumber(tokens).multipliedBy(BigNumber(10).pow(18)));

    return new Promise((resolve, reject) => {
        web3.eth.getAccounts( async (err, accounts) => {
            if(err) {
                reject(err);
            }

            ExchangeInstance.methods.purchaseETH(amount_to_convert).send({
                from: accounts[0]
            }).once("transactionHash", (txHash) => {
                resolve(txHash);
            }
            )
        })
    });
}

export const convertToTokens = async (tokens) => {
    const amount_to_convert = web3.utils.toHex(BigNumber(tokens).multipliedBy(BigNumber(10).pow(18)));

    return new Promise((resolve, reject) => {
        web3.eth.getAccounts( async (err, accounts) => {
            if(err) {
                reject(err);
            }

            ExchangeInstance.methods.purchaseTokens().send({
                from: accounts[0],
                value: amount_to_convert
            }).once("transactionHash", (txHash) => {
                resolve(txHash);
            }
            )
        })
    });
}