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
  
  struct PullRequest {
      bytes32 id;
      uint64 issueNumber;
      address creator;
  }

  mapping(address => Repo[]) repoOwner;
  mapping(bytes32 => Issue[]) repoIssues;
  mapping(bytes32 => uint256) issueBounty;
  mapping(bytes32 => bool) hasBountyOption;
  mapping(bytes32 => address) repoIdOwner;
  mapping(bytes32 => bytes32) issueIdRepoId;
  mapping(bytes32 => mapping(uint64 => PullRequest[])) repoPullRequests;
  mapping(bytes32 => address) pullRequestIdCreator;
  mapping(address => bytes32) creatorPullRequestId;

  event NewRepoEvent(string repoOwner, string repoName, bytes32 repoId);
  event NewIssueEvent(string repoOwner, string repoName, bytes32 issueId, uint256 bounty);
  event NewPullRequestEvent(address pullRequestCreator, string repoName, uint64 issueId);

  constructor() public {}
  
  modifier onlyRepoOwner(
      string memory _repoOwner,
      string memory _repoName
  )
  {
      bytes32 repoId = keccak256(abi.encodePacked(_repoName, _repoOwner));
      require(msg.sender == repoIdOwner[repoId], 'This function is callable only by the repo owner');
      _;
  }

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
      repoIdOwner[repoId] = msg.sender;
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
      
      require(issueIdRepoId[issueId] == 0, "Issue already existing");
      
      repoIssues[repoId].push(Issue(issueId, _issueNumber, msg.sender, msg.value));
      issueBounty[issueId] = msg.value;
      issueIdRepoId[issueId] = repoId;
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
  
  /**
   * User can do only one PR for an issue (for now)
   * */
  function newPullRequest (
      string memory _repoOwner,
      string memory _repoName,
      uint64 _issueNumber
  )
      public
      returns (bool)
  {
      bytes32 issueId = keccak256(abi.encodePacked(_issueNumber, _repoName, _repoOwner));
      bytes32 repoId = keccak256(abi.encodePacked(_repoName, _repoOwner));
      require(issueIdRepoId[issueId] == repoId, "Issue not existing");
      
      bytes32 pullRequestId = keccak256(abi.encodePacked(_repoName, _repoOwner, _issueNumber, msg.sender));
      require(pullRequestIdCreator[pullRequestId] != msg.sender, "msg.sender has already done a PR on this issue");
      
      repoPullRequests[repoId][_issueNumber].push(PullRequest(pullRequestId, _issueNumber, msg.sender));
      pullRequestIdCreator[pullRequestId] = msg.sender;
      creatorPullRequestId[msg.sender] = pullRequestId;
      emit NewPullRequestEvent(msg.sender, _repoName, _issueNumber);
      return true;
  }
}
