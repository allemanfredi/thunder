pragma solidity >=0.4.21 <0.7.0;

contract Wallet {
  struct Repo {
      bytes32 id;
      string name;
      string owner;
  }

  struct Issue {
      bytes32 id;
      uint64 number;
      address creator;
      uint256 bounty;
  }

  mapping(address => Repo[]) repoOwner;
  mapping(bytes32 => Issue[]) repoIssues;
  mapping(bytes32 => uint256) issueBounty;
  mapping(bytes32 => bool) hasBountyOption;

  event NewRepoEvent(string repoOwner, string repoName, bytes32 repoId);
  event NewIssueEvent(string repoOwner, string repoName, bytes32 issueId, uint256 boutny);

  constructor() public {}

  function newRepo (
      string memory _repoOwner,
      string memory _repoName
  )
      public
      returns (bool)
  {
      bytes32 repoId = keccak256(abi.encodePacked(_repoName, _repoOwner));
      repoOwner[msg.sender].push(Repo(repoId, _repoName, _repoOwner));
      hasBountyOption[repoId] = true;
      emit NewRepoEvent(_repoOwner, _repoName, repoId);
      return true;
  }

  function newIssue (
      string memory _repoOwner,
      string memory _repoName,
      uint64 _issueNumber
  )
      public
      payable
      returns (bool)
  {
      require(msg.value > 0, "Issue bounty must be greater than 0");
      bytes32 issueId = keccak256(abi.encodePacked(_issueNumber, _repoName, _repoOwner));
      bytes32 repoId = keccak256(abi.encodePacked(_repoName, _repoOwner));
      repoIssues[repoId].push(Issue(issueId, _issueNumber, msg.sender, msg.value));
      issueBounty[issueId] = msg.value;
      emit NewIssueEvent(_repoOwner, _repoName, issueId, msg.value);
      return true;
  }

  function getIssuePrice (
      string memory _repoOwner,
      string memory _repoName,
      uint64 _issueNumber
  )
      public
      view
      returns (uint256)
  {
      bytes32 issueId = keccak256(abi.encodePacked(_issueNumber, _repoName, _repoOwner));
      return issueBounty[issueId];
  }
  
  function hasRepoBountyOption (
      string memory _repoOwner,
      string memory _repoName
  )   
      public
      view
      returns (bool)
  {
      bytes32 repoId = keccak256(abi.encodePacked(_repoName, _repoOwner));
      return hasBountyOption[repoId];
  }
}