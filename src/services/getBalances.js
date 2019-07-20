import web3 from './web3'
import FUSD_Instance from './FUSD_Instance'
import config from '../config'

export const getEtherBalance = async () => {
    return new Promise((resolve, reject) => {
        web3.eth.getAccounts((err, accounts) => {
            if(err) {
                reject(err);
            }
            web3.eth.getBalance(accounts[0], (err, balance) => {
                if(err) {
                    reject(err);
                }
                resolve(balance); 
            });
        })   
    });
    
}

export const getTokenBalance = async () => {
    return new Promise((resolve, reject) => {
        web3.eth.getAccounts( async (err, accounts) => {
            if(err) {
                reject(err);
            }
            const balance = await FUSD_Instance.methods.balanceOf(accounts[0]).call();
            resolve(balance);
        });
    });
}   

export const getAllowance = () => {
    return new Promise((resolve, reject) => {
        web3.eth.getAccounts( async (err, accounts) => {
            if(err) {
                reject(err);
            }
            const balance = await FUSD_Instance.methods.allowance(accounts[0], config.address_Exchange).call();
            resolve(balance);
        });
    });
}
