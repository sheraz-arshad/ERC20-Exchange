import React, { Component } from 'react';
import { getEtherBalance, getTokenBalance, getAllowance } from '../services/getBalances';
import { approveTokens, convertToETH } from '../services/Transactions'

class Info extends Component {
    state = { 
        etherBalance: 0,
        tokenBalance: 0,
        allowance: 0
    }
     
    async componentWillMount() {
        const etherBalance = await getEtherBalance();
        this.setState({ etherBalance: etherBalance/ 10 ** 18 });

        const tokenBalance = await getTokenBalance();
        this.setState({ tokenBalance: tokenBalance/ 10**18 });

        const allowance = await getAllowance();
        this.setState({ allowance: allowance/ 10**18 });
    }

    approveTokens = async () => {
        const txHash = await approveTokens();
        alert(`You have approved our FUSD Exchange to access your wallet. Link: https://etherscan.io/tx/${txHash}`);
        window.location.reload();
    }

    render() { 
        return ( <div style={styles.box}>
            <h1 style={{color: "white", fontWeight: "bold", fontSize: "40px"}}>FUSD EXCHANGE</h1>
            <div>
                <label>ETH Balance:</label> {this.state.etherBalance} ETH
            </div>
            <div>
            <label>FUSD Balance:</label> {this.state.tokenBalance} FUSD
            </div>
            {this.state.allowance < 1000 ? <button style={{width: "200px", backgroundColor: "#8B0000"}} onClick={this.approveTokens}>Approve Access To Wallet</button> : ""}
        </div> );
    }
}

const styles = {
    box: {
        minHeight: "100px",
        minWidth: "200px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center",
        margin: "10px"
    }
}
 
export default Info;