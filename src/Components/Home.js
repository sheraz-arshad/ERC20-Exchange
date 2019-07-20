import React, { Component } from 'react';
import Info from './Info'
import Trade from './Trade'

class Home extends Component {
    state = {  }
    render() { 
        return (<div style={styles.box}>
            <Info />
            <Trade />
        </div> );
    }
}

const styles = {
    box: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
    }
}
 
export default Home;