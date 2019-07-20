import React, { Component } from 'react';
import axios from 'axios';

import { approveTokens, convertToETH } from '../services/Transactions'

class PurchaseETH extends Component {
    state = { 
        tokens: 0,
        estimateETH: 0
    }

    convert = async () => {
        if(this.state.tokens == 0) {
            alert("please input valid tokens amount");
            return;
        }

        const txHash = await convertToETH(this.state.tokens);
        console.log(txHash)
        alert(`FUSD has been converted to ETH. Link: https://etherscan.io/tx/${txHash}`);
        window.location.reload();
    }

    estimateConversion = async () => {
        const response = await axios.get("https://api.pro.coinbase.com/products/ETH-USD/ticker");
        const price = response.data.price;
        
        const estimateETH = (this.state.tokens * (10 ** 18))/ price;
        const fee = estimateETH * .05;
        const final_estimateETH = estimateETH - fee;

        this.setState({ estimateETH: final_estimateETH/ 10**18});

    }
    
    render() { 
        return (<div>
                    <div style={styles.box}>
                        <label>FUSD to ETH</label>
                        <input type="text" onChange={(e) => {
                            this.setState({ tokens: e.target.value });
                            this.estimateConversion();
                        }}
                        value={this.state.tokens}
                        />

                        <div>
                            { this.state.estimateETH > 0 ? <label>You will receive <strong>{this.state.estimateETH.toFixed(8)}</strong> ETH for <strong>{this.state.tokens}</strong> FUSD. (Estimated)</label> : ""}
                        </div>
                        <button onClick={this.convert}>Convert</button>
                    </div>
                </div>);
    }
}
 
const styles = {
    box: {
        border: "2px solid white",
        bordrRadius: "5px",
        height: "230px",
        width: "250px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "space-around",
        padding: "30px",
        margin: "5px",
        backgroundColor: "white"
    }
}
export default PurchaseETH;