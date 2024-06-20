// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SavingsContract {
    address public owner;
    uint public minimumDeposit;
    mapping(address => uint) public balances;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Seul le proprietaire peut executer cette fonction");
        _;
    }

    function setMinimumDeposit(uint _minimumDeposit) public onlyOwner {
        minimumDeposit = _minimumDeposit;
    }

    function deposit() public payable {
        require(msg.value >= minimumDeposit, "Le montant du depot est inferieur au minimum requis");
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint _amount) public {
        require(balances[msg.sender] >= _amount, "Solde insuffisant pour le retrait");
        balances[msg.sender] -= _amount;
        payable(msg.sender).transfer(_amount);
    }

    function getBalance() public view returns (uint) {
        return balances[msg.sender];
    }
}