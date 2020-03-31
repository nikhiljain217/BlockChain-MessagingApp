pragma solidity ^0.5.0;

contract Messages{
	uint256 public messageCount=0;
	uint256 public participantCount=0;
	struct Mess{
		uint id;
		string author;
		string content;

	}

	struct Participant
	{
		uint id;
		string author;
	}

	mapping(uint256 => Participant) public participants;


	mapping(uint256 => Mess) public messages;

	function addParticipant(string memory _author) public
	{
	participantCount++;
	participants[participantCount]= Participant(participantCount,_author);
	}

	function addMessage(string memory _content,string memory _author) public {
	messageCount++;
	messages[messageCount] = Mess(messageCount, _author, _content);



	}
}