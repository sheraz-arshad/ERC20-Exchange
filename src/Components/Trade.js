import React, { Component } from 'react';
import PurchaseETH from './PurchaseETH'
import PurchaseTokens from './PurchaseTokens'

class Trade extends Component {
    state = {  }
    render() { 
        return (<div style={styles.box} id="tradeBox">
            <PurchaseETH />
            <PurchaseTokens />
        </div>);
    }
}
 
const styles = {
    box: {
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        flexDirection: "column",
        height: "650px"
    }
}

export default Trade;