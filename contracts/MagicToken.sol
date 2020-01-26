pragma solidity ^0.5.0;

import "@openzeppelin/upgrades/contracts/Initializable.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/cryptography/ECDSA.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC721/ERC721Full.sol";

contract MagicToken is Initializable, ERC721Full, Ownable {
  //it keeps a count to demonstrate stage changes
  uint private count;

  function initialize(uint num) public initializer {
    Ownable.initialize(msg.sender);
    ERC721.initialize();
    ERC721Enumerable.initialize();
    ERC721Metadata.initialize("MyNFT", "MNFT");
    count = num;
  }

  function awardItem(
    address to,
    uint256 tokenId,
    string memory tokenUri,
    uint256 price,
    bytes memory signedTokenURI
  ) public payable {
    require(msg.value == price, 'Value sent does not match token price');
    require(!_exists(tokenId), 'Item already sold');

    bytes32 tokenURIHash = hashTokenUri(tokenId, tokenUri, price);

    bytes32 ethSigned = ECDSA.toEthSignedMessageHash(tokenURIHash);
    address signer = ECDSA.recover(ethSigned, signedTokenURI);

    require(signer != address(0), "Invalid Token Metadata signer");
    require(signer == owner(), "Invalid signature");

    _mint(to, tokenId);
    _setTokenURI(tokenId, tokenUri);
  }

  function hashTokenUri(uint256 tokenId, string memory tokenUri, uint256 price) public pure returns (bytes32) {
    return keccak256(abi.encodePacked(tokenId, tokenUri, price));
  }
}
