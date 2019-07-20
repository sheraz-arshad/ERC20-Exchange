import React, { Component } from 'react';
import axios from 'axios';

import { convertToTokens } from '../services/Transactions'

class PurchaseTokens extends Component {
    state = { 
        ETH: 0,
        estimateTokens: 0
    }

    convert = async () => {
        if(this.state.ETH == 0) {
            alert("Please input valid Ether amount");
            return;
        }

        const txHash = await convertToTokens(this.state.ETH);
        console.log("TXHASH", txHash);
        alert(`ETH have been converted to FUSD. Link: https://etherscan.io/tx/${txHash}`);
        window.location.reload();

    }

    esitmateConversion = async () => {
        const response = await axios.get("https://api.pro.coinbase.com/products/ETH-USD/ticker");
        const price = response.data.price;
        console.log(price)
        const fee = this.state.ETH * .05;
        const final_estimateTokens = (this.state.ETH - fee) * price;

        this.setState({ estimateTokens: final_estimateTokens});
    }
    
    render() { 
        return (<div>
                    <div style={styles.box}>
                        <label>ETH to FUSD</label>
                        <input type="text" onChange={(e) => {
                            this.setState({ ETH: e.target.value });
                            this.esitmateConversion();
                        }}
                        value={this.state.ETH}
                        />
                         <div>
                            { this.state.estimateTokens > 0 ? <label>You will receive <strong>{this.state.estimateTokens.toFixed(8)}</strong> FUSD for <strong>{this.state.ETH}</strong> ETH. (Estimated) </label> : ""}
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
export default PurchaseTokens;