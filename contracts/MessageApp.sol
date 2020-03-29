pragma solidity ^0.5.0;

contract Messages{
	uint256 public messageCount=0;

	struct Mess{
		uint id;
		string author;
		string content;
		uint256 timestamp;

	}


	mapping(uint256 => Mess) public messages;

	function addMessage(string memory _content) public {
	messageCount++;
	messages[messageCount] = Mess(messageCount, "Nikhil", _content, now);



	}
}