pragma solidity >=0.4.21 <0.7.0;

contract Wallet {
  address public owner;

  struct Repo {
      bytes32 id;
      string name;
  }

  struct Issue {
      bytes32 id;
      uint64 number;
  }

  mapping(string => Repo[]) repoOwner;
  mapping(bytes32 => Issue[]) repoIssues;
  mapping(bytes32 => uint256) issueBounty;

  event NewRepoEventLog(string description);
  event RedeemIssueEvent(string repoName, bytes32 id);
  event NewRepoEvent(string repoOwner, string repoName, bytes32 repoId);
  event NewIssueEvent(string repoOwner, string repoName, bytes32 issueId, uint256 boutny);

  modifier onlyNotOwner() { require(msg.sender == owner, "owner not allowed"); _; }

  constructor() public {
    owner = msg.sender;
  }

  function newRepo (
      string memory _repoOwner,
      string memory _repoName
  )
      public
      returns (bool)
  {
      bytes32 repoId = keccak256(abi.encodePacked(_repoName, _repoOwner));
      repoOwner[_repoOwner].push(Repo(repoId, _repoName));
      emit NewRepoEventLog("New Github repo created.");
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
      repoIssues[repoId].push(Issue(issueId, _issueNumber));
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

/*  function redeemIssue(
    address receiver,
    bytes32 id,
    string memory repoName
  ) public onlyNotOwner returns (bool) {
    require(balances[msg.sender] >= issueBounty[id], "Insufficient balance for redeem");
    (bool success, ) = receiver.call.value(issueBounty[id])("");
    require(success, "Transfer failed.");
    emit RedeemIssueEvent(repoName, id);
    return true;
  }*/
}
