// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MarketPlace {
    address public owner;  // Address of the owner (you)
    address payable public ecommerceWallet;  // Address where payments will be received

    event PaymentReceived(address indexed from, uint256 amount);
    event PaymentSent(address indexed to, uint256 amount);

    constructor() {
        owner = msg.sender;
        ecommerceWallet = payable(owner);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    // Function to receive Ether payments
    receive() external payable {
        emit PaymentReceived(msg.sender, msg.value);
    }

    // Function to withdraw funds from the contract (only owner)
    function withdrawFunds(uint256 amount) public onlyOwner {
        require(amount <= address(this).balance, "Insufficient balance");
        ecommerceWallet.transfer(amount);
    }

    // Function to send a payment to the ecommerceWallet
    function sendPayment() public payable {
        require(msg.value > 0, "Payment amount must be greater than 0");
        emit PaymentSent(ecommerceWallet, msg.value);
    }
}