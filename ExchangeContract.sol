pragma solidity ^0.5.7;

import "github.com/oraclize/ethereum-api/oraclizeAPI.sol";

// ----------------------------------------------------------------------------
// ERC Token Standard #20 Interface
// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20-token-standard.md
// ----------------------------------------------------------------------------
contract ERC20Interface {
    function totalSupply() public view returns (uint);
    function balanceOf(address tokenOwner) public view returns (uint balance);
    function allowance(address tokenOwner, address spender) public view returns (uint remaining);
    function transfer(address to, uint tokens) public returns (bool success);
    function approve(address spender, uint tokens) public returns (bool success);
    function transferFrom(address from, address to, uint tokens) public returns (bool success);

    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
}

contract FUSDExchange is usingOraclize {
    ERC20Interface public token;
    address payable public owner;
    
    enum OrderType { Token, Ether }
    enum OrderStatus { Pending, Fulfilled }
    
    struct Order {
        address payable receiver;
        uint256 weiValue;
        uint256 tokens;
        OrderType typeOfOrder;
        OrderStatus status;
    }
    
    uint256 public amount;
    mapping(bytes32 => Order) public orders;
    
    uint public gasLimit;
    
    constructor(ERC20Interface _token) public payable {
        token = _token;
        owner = msg.sender;
        oraclize_setCustomGasPrice(4000000000);
        gasLimit = 85000;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "caller is not the owner");
        _;
    }
    
    event OwnerChanged(address oldOwner, address newOwner);
    
    function changeOwner(address payable newOwner) public onlyOwner {
        owner = newOwner;
        emit OwnerChanged(msg.sender, newOwner);
    }
    
    function changeOraclizeGasPrice(uint gasPrice) public onlyOwner {
        oraclize_setCustomGasPrice(gasPrice);
    }
    
    function changeOraclizeGasLimit(uint _gastLimit) public onlyOwner {
        gasLimit = _gastLimit;
    }
    
    event ETHOrderPlaced(bytes32 orderID, address placer, uint256 tokenAmount);
    
    function purchaseETH(uint256 tokens) public payable {
        require(tokens > 0, "tokens amount should be greater than zero.");
        require(token.transferFrom(msg.sender, address(this), tokens));
       
        bytes32 orderID = oraclize_query("URL", "json(https://api.pro.coinbase.com/products/ETH-USD/ticker).price", gasLimit);
        
        Order memory newOrder = Order(msg.sender, 0, tokens, OrderType.Ether, OrderStatus.Pending);

        orders[orderID] = newOrder;
        
        emit ETHOrderPlaced(orderID, msg.sender, tokens);

    }
    
    event TokensOrderPlaced(bytes32 orderID, address placer, uint256 weiAmount);
    
    function purchaseTokens() public payable {
        require(msg.value > 0, "send more than 0 Ethers");

        bytes32 orderID = oraclize_query("URL", "json(https://api.pro.coinbase.com/products/ETH-USD/ticker).price", gasLimit);
        
        Order memory newOrder = Order(msg.sender, msg.value, 0, OrderType.Token, OrderStatus.Pending);

        orders[orderID] = newOrder;
        
        emit TokensOrderPlaced(orderID, msg.sender, msg.value);

    }
    
    event OrderCompleted(bytes32 orderID, address receiver, uint typeOfOrder);
    
    function __callback(bytes32 myid, string memory result) public {
       if (msg.sender != oraclize_cbAddress()) revert();
       
       uint256 ETH_IN_USD = parseInt(result);
       amount = ETH_IN_USD;
      Order storage current_order = orders[myid];
      require(current_order.status == OrderStatus.Pending, "Order is already fulfilled");
       
      if(current_order.typeOfOrder == OrderType.Ether) {
          uint256 tokens = current_order.tokens;
          uint256 WEI_TO_SEND = tokens / ETH_IN_USD;
          uint256 fee = ((WEI_TO_SEND * 100) / 20) / 100;
          uint256 final_wei_to_send = WEI_TO_SEND - fee;
          
          current_order.status = OrderStatus.Fulfilled;
           
          current_order.receiver.transfer(final_wei_to_send);
           
      } else if(current_order.typeOfOrder == OrderType.Token) {
          uint256 weiValue = current_order.weiValue;
          uint256 fee = ((weiValue * 100) / 20) / 100;
          uint256 remainingWEI = weiValue - fee;
           
          uint256 tokensAmountToSend = (remainingWEI * ETH_IN_USD);
          current_order.status = OrderStatus.Fulfilled;

          require(token.transfer(current_order.receiver, tokensAmountToSend));
      }

      emit OrderCompleted(myid, current_order.receiver, uint(current_order.typeOfOrder));
   }
   
   function withdrawWEI(uint256 _amount) public onlyOwner {
       require(_amount <= address(this).balance, "contract does not have enough balance");
       owner.transfer(_amount);
   }
   
   function withdrawTokens(uint256 _amount) public onlyOwner {
       require(token.balanceOf(address(this)) >= _amount, "contract does not havee enough token balance");
       require(token.transfer(owner, _amount));
   }
   
      function() external payable {
           
      }
    
}