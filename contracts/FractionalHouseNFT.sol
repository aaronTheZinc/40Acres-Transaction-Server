// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FractionalProperty is ERC721, Ownable {
    address public fractionalTokenAddress;
    uint256 public propertyValue;
    uint256 public totalShares;

    constructor(
        string memory name,
        string memory symbol,
        uint256 _initialPropertyValue,
        uint256 _totalShares
    ) ERC721(name, symbol) Ownable(msg.sender) {
        propertyValue = _initialPropertyValue;
        totalShares = _totalShares;
    }

    // Mint the property NFT
    function mintProperty(address to, uint256 tokenId) public onlyOwner {
        _mint(to, tokenId);
    }

    // Set the fractional token address
    function setFractionalToken(
        address _fractionalTokenAddress
    ) external onlyOwner {
        fractionalTokenAddress = _fractionalTokenAddress;
    }

    // Update property value
    function updatePropertyValue(uint256 newValue) external onlyOwner {
        propertyValue = newValue;
    }

    // Get total number of shares
    function getTotalShares() external view returns (uint256) {
        return totalShares;
    }
}

contract FractionalToken is ERC20, Ownable {
    address public propertyContract;
    uint256 public sharePrice;
    uint256 public totalShares;
    uint256 public constant MIN_PURCHASE = 1;

    event SharesPurchased(
        address indexed buyer,
        uint256 amount,
        uint256 totalCost
    );
    event SharesSold(
        address indexed seller,
        uint256 amount,
        uint256 totalProceeds
    );
    event SharePriceUpdated(uint256 oldPrice, uint256 newPrice);

    constructor(
        string memory name,
        string memory symbol,
        uint256 _totalShares,
        uint256 initialSharePrice,
        address initialPropertyContract
    ) ERC20(name, symbol) Ownable(msg.sender) {
        totalShares = _totalShares;
        propertyContract = initialPropertyContract;
        _mint(msg.sender, _totalShares);
        sharePrice = initialSharePrice;
    }

    // Allow setting the property contract
    function setPropertyContract(address _propertyContract) external onlyOwner {
        propertyContract = _propertyContract;

        // Optionally, validate total shares with property contract
        if (_propertyContract != address(0)) {
            uint256 propertyTotalShares = FractionalProperty(_propertyContract)
                .getTotalShares();
            require(totalShares == propertyTotalShares, "Shares mismatch");
        }
    }

    // Update share price with event
    function setSharePrice(uint256 newPrice) external onlyOwner {
        uint256 oldPrice = sharePrice;
        sharePrice = newPrice;
        emit SharePriceUpdated(oldPrice, newPrice);
    }

    // Purchase shares
    function purchaseShares(uint256 amount) external payable {
        require(propertyContract != address(0), "Property contract not set");
        require(amount >= MIN_PURCHASE, "Purchase amount too low");
        require(amount <= totalShares, "Exceeds total shares");

        uint256 totalCost = amount * sharePrice;
        require(msg.value >= totalCost, "Insufficient payment");
        require(balanceOf(owner()) >= amount, "Not enough shares available");

        // Transfer shares from owner to buyer
        _transfer(owner(), msg.sender, amount);

        // Refund excess payment
        if (msg.value > totalCost) {
            payable(msg.sender).transfer(msg.value - totalCost);
        }

        emit SharesPurchased(msg.sender, amount, totalCost);
    }

    // Sell shares back to the contract
    function sellShares(uint256 amount) external {
        require(propertyContract != address(0), "Property contract not set");
        require(balanceOf(msg.sender) >= amount, "Insufficient shares");

        uint256 totalProceeds = amount * sharePrice;

        // Transfer shares from seller to owner
        _transfer(msg.sender, owner(), amount);

        // Send payment to seller
        payable(msg.sender).transfer(totalProceeds);

        emit SharesSold(msg.sender, amount, totalProceeds);
    }

    // Transfer shares with validation
    function transferShares(address to, uint256 amount) external {
        require(propertyContract != address(0), "Property contract not set");
        transfer(to, amount);
    }

    // Withdraw contract balance (only owner)
    function withdrawFunds() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    // Get current share details
    function getShareDetails()
        external
        view
        returns (
            uint256 currentSharePrice,
            uint256 currentTotalShares,
            uint256 availableShares
        )
    {
        return (sharePrice, totalShares, balanceOf(owner()));
    }
}
