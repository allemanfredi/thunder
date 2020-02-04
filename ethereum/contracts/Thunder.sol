pragma solidity >=0.4.21 <0.7.0;


contract Thunder {
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
    bool isClosed;
  }

  struct PullRequest {
    bytes32 id;
    uint64 issueNumber;
    uint64 number;
    address creatorAddress;
    string creatorName;
    bool isClosed;
  }

  struct User {
    uint64 numberOfIssues;
    uint64 numberOfIssuesClosedCorrectly;
    uint64 numberOfIssuesClosedNotCorrectly;
    uint256 reputation;
    bool created;
    address addr;
  }

  mapping(address => Repo[]) repoOwner;
  mapping(bytes32 => Issue[]) repoIssues;
  mapping(bytes32 => uint256) issueBounty;
  mapping(bytes32 => bool) hasBountyOption;
  mapping(bytes32 => address) pullRequestIdCreator;
  mapping(bytes32 => address) repoIdOwner;
  mapping(bytes32 => bytes32) issueIdRepoId;
  mapping(bytes32 => mapping(bytes32 => mapping(address => PullRequest))) repoPullRequests;
  mapping(bytes32 => mapping(bytes32 => PullRequest[])) repoPullRequestsArr;
  mapping(string => User) usernameUserInfo;

  event NewRepo(string repoOwner, string repoName, bytes32 repoId);
  event NewIssue(
    string repoOwner,
    string repoName,
    bytes32 issueId,
    uint256 bounty
  );
  event NewPullRequest(
    string pullRequestCreatorName,
    string repoOwner,
    string repoName,
    uint64 pullRequestNumber,
    uint64 issueNumber
  );
  event NewAcceptedPullRequested(
    string repoName,
    string repoOwner,
    string pullRequestCreatorName,
    uint64 issueNumber,
    uint64 pullRequestNumber
  );

  constructor() public {}

  modifier onlyRepoOwner(string memory _repoOwner, string memory _repoName) {
    bytes32 repoId = getRepoId(_repoOwner, _repoName);
    require(
      msg.sender == repoIdOwner[repoId],
      'onlyRepoOwner -> This function is callable only by the repo owner'
    );
    _;
  }

  function newRepo(string memory _repoOwner, string memory _repoName)
    public
    returns (bool)
  {
    bytes32 repoId = getRepoId(_repoOwner, _repoName);
    require(
      repoIdOwner[repoId] == address(0),
      'newRepo -> Repository already existing'
    );

    repoOwner[msg.sender].push(Repo(repoId, _repoName, _repoOwner));
    hasBountyOption[repoId] = true;
    repoIdOwner[repoId] = msg.sender;

    User memory user = usernameUserInfo[_repoOwner];
    if (user.created == false) {
      usernameUserInfo[_repoOwner] = User(0, 0, 0, 0, true, msg.sender);
    }

    emit NewRepo(_repoOwner, _repoName, repoId);
    return true;
  }

  function newIssue(
    string memory _repoOwner,
    string memory _repoName,
    uint64 _issueNumber
  ) public payable returns (bool) {
    require(msg.value > 0, 'newIssue -> Issue bounty must be greater than 0');

    bytes32 repoId = getRepoId(_repoOwner, _repoName);
    require(
      repoIdOwner[repoId] != address(0),
      'newIssue -> Repository not existing'
    );

    bytes32 issueId = getIssueId(_repoOwner, _repoName, _issueNumber);

    require(issueIdRepoId[issueId] == 0, 'newIssue -> Issue already existing');

    repoIssues[repoId].push(
      Issue(issueId, _issueNumber, msg.sender, msg.value, false)
    );
    issueBounty[issueId] = msg.value;
    issueIdRepoId[issueId] = repoId;

    User storage user = usernameUserInfo[_repoOwner];
    if (user.created == false) {
      usernameUserInfo[_repoOwner] = User(1, 0, 0, 0, true, msg.sender);
    } else {
      user.numberOfIssues += 1;
    }

    emit NewIssue(_repoOwner, _repoName, issueId, msg.value);
    return true;
  }

  function getIssueBounty(
    string memory _repoOwner,
    string memory _repoName,
    uint64 _issueNumber
  ) public view returns (uint256) {
    bytes32 issueId = getIssueId(_repoOwner, _repoName, _issueNumber);
    return issueBounty[issueId];
  }

  function hasRepoBountyOption(
    string memory _repoOwner,
    string memory _repoName
  ) public view returns (bool) {
    bytes32 repoId = getRepoId(_repoOwner, _repoName);
    return hasBountyOption[repoId];
  }

  function newPullRequest(
    string memory _repoOwner,
    string memory _repoName,
    uint64 _issueNumber,
    uint64 _pullRequestNumber,
    string memory _creatorName
  ) public returns (bool) {
    require(
      _issueNumber != _pullRequestNumber,
      'newPullRequest -> Impossible to create an issue with the same number of the pull request'
    );

    bytes32 repoId = getRepoId(_repoOwner, _repoName);
    bytes32 issueId = getIssueId(_repoOwner, _repoName, _issueNumber);
    require(
      issueIdRepoId[issueId] == repoId,
      'newPullRequest -> Issue not existing'
    );
    bytes32 pullRequestId = getPullRequestId(
      _repoOwner,
      _repoName,
      _issueNumber,
      _pullRequestNumber,
      msg.sender
    );
    require(
      pullRequestIdCreator[pullRequestId] != msg.sender,
      'msg.sender has already done a PR on this issue'
    );

    //TODO: _creatorName can do only a PR in order to don't be hacked (2 address for a username)

    PullRequest memory pullRequest = PullRequest(
      pullRequestId,
      _issueNumber,
      _pullRequestNumber,
      msg.sender,
      _creatorName,
      false
    );
    repoPullRequests[repoId][issueId][msg.sender] = pullRequest;
    repoPullRequestsArr[repoId][issueId].push(pullRequest);
    pullRequestIdCreator[pullRequestId] = msg.sender;

    emit NewPullRequest(
      _creatorName,
      _repoOwner,
      _repoName,
      _pullRequestNumber,
      _issueNumber
    );
    return true;
  }

  function getNumberOfPullRequests(
    string memory _repoOwner,
    string memory _repoName,
    uint64 _issueNumber
  ) public view returns (uint256) {
    bytes32 repoId = getRepoId(_repoOwner, _repoName);
    bytes32 issueId = getIssueId(_repoOwner, _repoName, _issueNumber);
    return repoPullRequestsArr[repoId][issueId].length;
  }

  function getPullRequest(
    string memory _repoOwner,
    string memory _repoName,
    uint64 _issueNumber,
    uint256 _index
  ) public view returns (address, string memory) {
    bytes32 repoId = getRepoId(_repoOwner, _repoName);
    bytes32 issueId = getIssueId(_repoOwner, _repoName, _issueNumber);
    PullRequest memory pullRequest = repoPullRequestsArr[repoId][issueId][_index];
    return (pullRequest.creatorAddress, pullRequest.creatorName);
  }

  function acceptPullRequest(
    string memory _repoOwner,
    string memory _repoName,
    uint64 _issueNumber,
    uint64 _pullRequestNumber,
    address _receiver
  ) public onlyRepoOwner(_repoOwner, _repoName) returns (bool) {
    bytes32 repoId = getRepoId(_repoOwner, _repoName);
    bytes32 issueId = getIssueId(_repoOwner, _repoName, _issueNumber);
    require(
      issueIdRepoId[issueId] == repoId,
      'acceptPullRequest -> Issue not existing'
    );

    bytes32 pullRequestId = getPullRequestId(
      _repoOwner,
      _repoName,
      _issueNumber,
      _pullRequestNumber,
      _receiver
    );
    require(
      pullRequestIdCreator[pullRequestId] == _receiver,
      "acceptPullRequest -> _receiver didn't perform a pull request"
    );

    require(
      isIssueClosed(repoId, issueId) == false,
      'acceptPullRequest -> Issue already closed'
    );

    PullRequest storage pullRequest = repoPullRequests[repoId][issueId][_receiver];
    require(
      pullRequest.isClosed == false,
      'acceptPullRequest -> Pull request already closed'
    );

    (bool success, ) = _receiver.call.value(issueBounty[issueId])('');
    require(
      success == true,
      'acceptPullRequest -> Error during bounty transfering'
    );

    //if msg.sender == _receiver then reputation should not increase as a user could self increase reputation
    if (_receiver != msg.sender) {
      increaseUserReputation(_repoOwner, issueBounty[issueId]);
    }

    pullRequest.isClosed = true;
    closeIssue(repoId, issueId);

    emit NewAcceptedPullRequested(
      _repoName,
      _repoOwner,
      pullRequest.creatorName,
      _issueNumber,
      _pullRequestNumber
    );

    return true;
  }

  function getUsernameInfo(string memory _username)
    public
    view
    returns (uint64, uint256)
  {
    User memory user = usernameUserInfo[_username];
    return (user.numberOfIssues, user.reputation);
  }

  function getPullRequestUsernameAddress(
    string memory _repoOwner,
    string memory _repoName,
    uint64 _issueNumber,
    string memory _username
  ) public view returns (address) {
    bytes32 repoId = getRepoId(_repoOwner, _repoName);
    bytes32 issueId = getIssueId(_repoOwner, _repoName, _issueNumber);
    PullRequest[] memory pullRequestArr = repoPullRequestsArr[repoId][issueId];
    for (uint256 i = 0; i < pullRequestArr.length; i++) {
      if (
        keccak256(abi.encodePacked(pullRequestArr[i].creatorName)) ==
        keccak256(abi.encodePacked(_username))
      ) {
        return pullRequestArr[i].creatorAddress;
      }
    }
    return address(0);
  }

  function getPullRequestId(
    string memory _repoOwner,
    string memory _repoName,
    uint64 _issueNumber,
    uint64 _pullRequestNumber,
    address _receiver
  ) internal pure returns (bytes32) {
    return
      keccak256(
        abi.encodePacked(
          _repoOwner,
          _repoName,
          _issueNumber,
          _pullRequestNumber,
          _receiver
        )
      );
  }

  function getIssueId(
    string memory _repoOwner,
    string memory _repoName,
    uint64 _issueNumber
  ) internal pure returns (bytes32) {
    return keccak256(abi.encodePacked(_repoOwner, _repoName, _issueNumber));
  }

  function getRepoId(string memory _repoOwner, string memory _repoName)
    internal
    pure
    returns (bytes32)
  {
    return keccak256(abi.encodePacked(_repoOwner, _repoName));
  }

  function increaseUserReputation(string memory _repoOwner, uint256 _bounty)
    internal
  {
    User storage user = usernameUserInfo[_repoOwner];
    user.numberOfIssuesClosedCorrectly += 1;
    user.reputation +=
      (_bounty * user.numberOfIssuesClosedCorrectly) -
      (_bounty * user.numberOfIssuesClosedNotCorrectly);
  }

  function closeIssue(bytes32 _repoId, bytes32 _issueId) internal {
    Issue[] storage issues = repoIssues[_repoId];
    for (uint256 i = 0; i < issues.length; i++) {
      if (issues[i].id == _issueId) {
        issues[i].isClosed = true;
        return;
      }
    }
  }

  function isIssueClosed(bytes32 _repoId, bytes32 _issueId)
    internal
    view
    returns (bool)
  {
    Issue[] memory issues = repoIssues[_repoId];
    for (uint256 i = 0; i < issues.length; i++) {
      if (issues[i].id == _issueId && issues[i].isClosed == true) {
        return true;
      }
    }
    return false;
  }

  //TODO: function for claiming bad behavior of repoOwner
}
