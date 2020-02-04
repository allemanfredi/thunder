const { ERROR_PREFIX, waitForEvent, getContract } = require('./utils')

const thunder = artifacts.require('./Thunder.sol')

const Web3 = require('web3')
const web3 = new Web3(
  new Web3.providers.WebsocketProvider('ws://localhost:9545')
)

contract(
  'Thunder Tests',
  ([CONTRACT_OWNER, ACCOUNT_1, ACCOUNT_2, ACCOUNT_3, ...accounts]) => {
    const GAS_LIMIT = 6e6

    it('Should create a new repo', async () => {
      const { methods, events } = await getContract(thunder, web3)

      const testRepoOwner = 'allemanfredi'
      const testRepoName = 'test'

      const params = [testRepoOwner, testRepoName]

      await methods.newRepo(...params).send({
        from: ACCOUNT_1,
        gas: GAS_LIMIT
      })

      const {
        returnValues: { repoOwner, repoName, repoId }
      } = await waitForEvent(events.NewRepo, null, 'latest')

      assert.strictEqual(repoOwner, testRepoOwner)
      assert.strictEqual(repoName, testRepoName)
      assert.strictEqual(repoId.length, 66) //kekkak256 = 64bytes + "0x" = 66
    })

    it('Should not create a repo equal to one that already exists', async () => {
      const { methods, events } = await getContract(thunder, web3)

      const expErr = 'revert'
      const testRepoOwner = 'allemanfredi'
      const testRepoName = 'test'

      const params = [testRepoOwner, testRepoName]

      await methods.newRepo(...params).send({
        from: ACCOUNT_1,
        gas: GAS_LIMIT
      })

      const {
        returnValues: { repoOwner, repoName, repoId }
      } = await waitForEvent(events.NewRepo, null, 'latest')

      try {
        await methods.newRepo(...params).send({
          from: ACCOUNT_1,
          gas: GAS_LIMIT
        })
        assert.fail(
          'It is not possible to create an equal repository for the same user'
        )
      } catch (err) {
        assert.isTrue(
          err.message.startsWith(`${ERROR_PREFIX}${expErr}`),
          `Expected ${expErr} but got ${err.message} instead!`
        )
      }
    })

    it('Should create a new issue', async () => {
      const { methods, events } = await getContract(thunder, web3)

      const testRepoOwner = 'allemanfredi'
      const testRepoName = 'test'
      const testIssueNumber = 1
      const testIssueBounty = 100

      const paramsForCreatingRepo = [testRepoOwner, testRepoName]
      const params = [testRepoOwner, testRepoName, testIssueNumber]

      await methods.newRepo(...paramsForCreatingRepo).send({
        from: ACCOUNT_1,
        gas: GAS_LIMIT
      })

      await methods.newIssue(...params).send({
        from: ACCOUNT_1,
        gas: GAS_LIMIT,
        value: testIssueBounty
      })

      const {
        returnValues: { repoOwner, repoName, issueId, bounty }
      } = await waitForEvent(events.NewIssue, null, 'latest')

      assert.strictEqual(repoOwner, testRepoOwner)
      assert.strictEqual(repoName, testRepoName)
      assert.strictEqual(issueId.length, 66)
      assert.strictEqual(parseInt(bounty), testIssueBounty)
    })

    it('Should not create a new issue with value = 0', async () => {
      const { methods } = await getContract(thunder, web3)

      const expErr = 'revert'

      const testRepoOwner = 'allemanfredi'
      const testRepoName = 'test'
      const testIssueNumber = 1
      const invalidIssueBounty = 0

      const paramsForCreatingRepo = [testRepoOwner, testRepoName]
      const params = [testRepoOwner, testRepoName, testIssueNumber]

      await methods.newRepo(...paramsForCreatingRepo).send({
        from: ACCOUNT_1,
        gas: GAS_LIMIT
      })

      try {
        await methods.newIssue(...params).send({
          from: ACCOUNT_1,
          gas: GAS_LIMIT,
          value: invalidIssueBounty
        })
        assert.fail('It is not possible to create a 0 issue bounty')
      } catch (err) {
        assert.isTrue(
          err.message.startsWith(`${ERROR_PREFIX}${expErr}`),
          `Expected ${expErr} but got ${err.message} instead!`
        )
      }
    })

    it('Should not create an issue equal to one that already exists', async () => {
      const { methods } = await getContract(thunder, web3)

      const expErr = 'revert'
      const testRepoOwner = 'allemanfredi'
      const testRepoName = 'test'
      const testIssueNumber = 1
      const testIssueBounty = 100

      const paramsForCreatingRepo = [testRepoOwner, testRepoName]

      const params = [testRepoOwner, testRepoName, testIssueNumber]

      await methods.newRepo(...paramsForCreatingRepo).send({
        from: ACCOUNT_1,
        gas: GAS_LIMIT
      })

      await methods.newIssue(...params).send({
        from: ACCOUNT_1,
        gas: GAS_LIMIT,
        value: testIssueBounty
      })

      try {
        await methods.newIssue(...params).send({
          from: ACCOUNT_1,
          gas: GAS_LIMIT,
          value: testIssueBounty
        })
        assert.fail(
          'It is not possible to create an issue equal to one that already exists'
        )
      } catch (err) {
        assert.isTrue(
          err.message.startsWith(`${ERROR_PREFIX}${expErr}`),
          `Expected ${expErr} but got ${err.message} instead!`
        )
      }
    })

    it('Should not create an issue on a repo not existing', async () => {
      const { methods } = await getContract(thunder, web3)

      const expErr = 'revert'
      const testRepoOwner = 'allemanfredi'
      const testRepoName = 'test'
      const testIssueNumber = 1
      const testIssueBounty = 100

      const params = [testRepoOwner, testRepoName, testIssueNumber]

      try {
        await methods.newIssue(...params).send({
          from: ACCOUNT_1,
          gas: GAS_LIMIT,
          value: testIssueBounty
        })
        assert.fail(
          'It is not possible to create an issue on a repo not existing'
        )
      } catch (err) {
        assert.isTrue(
          err.message.startsWith(`${ERROR_PREFIX}${expErr}`),
          `Expected ${expErr} but got ${err.message} instead!`
        )
      }
    })

    it('Should get an issue bounty', async () => {
      const { methods } = await getContract(thunder, web3)

      const testRepoOwner = 'allemanfredi'
      const testRepoName = 'test'
      const testIssueNumber = 1
      const testIssueBounty = 100

      const paramsForCreatingRepo = [testRepoOwner, testRepoName]
      const params = [testRepoOwner, testRepoName, testIssueNumber]

      await methods.newRepo(...paramsForCreatingRepo).send({
        from: ACCOUNT_1,
        gas: GAS_LIMIT
      })

      await methods.newIssue(...params).send({
        from: ACCOUNT_1,
        gas: GAS_LIMIT,
        value: testIssueBounty
      })

      const issueBounty = await methods.getIssueBounty(...params).call()
      assert.strictEqual(parseInt(issueBounty), testIssueBounty)
    })

    it('Should be a repo with bounty option', async () => {
      const { methods } = await getContract(thunder, web3)

      const testRepoOwner = 'allemanfredi'
      const testRepoName = 'test'

      const params = [testRepoOwner, testRepoName]

      await methods.newRepo(...params).send({
        from: ACCOUNT_1,
        gas: GAS_LIMIT
      })

      const hasBounties = await methods.hasRepoBountyOption(...params).call()
      assert.strictEqual(hasBounties, true)
    })

    it('Should not be a repo with bounty option', async () => {
      const { methods } = await getContract(thunder, web3)

      const testRepoOwner = 'allemanfredi'
      const testRepoName = 'test'

      const params = [testRepoOwner, testRepoName]

      const hasBounties = await methods.hasRepoBountyOption(...params).call()
      assert.strictEqual(hasBounties, false)
    })

    it('Should create a new pull request', async () => {
      const { methods, events } = await getContract(thunder, web3)

      const testRepoOwner = 'allemanfredi'
      const testRepoName = 'test'
      const testIssueNumber = 1
      const testPullRequestNumber = 2
      const testPullRequestCreator = 'pullRequestCreator'
      const testIssueBounty = 100

      const paramsForCreatingRepo = [testRepoOwner, testRepoName]
      const paramsForCreatingIssue = [
        testRepoOwner,
        testRepoName,
        testIssueNumber
      ]
      const params = [
        testRepoOwner,
        testRepoName,
        testIssueNumber,
        testPullRequestNumber,
        testPullRequestCreator
      ]

      await methods.newRepo(...paramsForCreatingRepo).send({
        from: ACCOUNT_1,
        gas: GAS_LIMIT
      })

      await methods.newIssue(...paramsForCreatingIssue).send({
        from: ACCOUNT_1,
        gas: GAS_LIMIT,
        value: testIssueBounty
      })

      await methods.newPullRequest(...params).send({
        from: ACCOUNT_2,
        gas: GAS_LIMIT
      })

      const {
        returnValues: {
          pullRequestCreatorName,
          repoOwner,
          repoName,
          pullRequestNumber,
          issueNumber
        }
      } = await waitForEvent(events.NewPullRequest, null, 'latest')

      assert.strictEqual(pullRequestCreatorName, testPullRequestCreator)
      assert.strictEqual(repoOwner, testRepoOwner)
      assert.strictEqual(repoName, testRepoName)
      assert.strictEqual(parseInt(pullRequestNumber), testPullRequestNumber)
      assert.strictEqual(parseInt(issueNumber), testIssueNumber)
    })

    it('Should not create a new pull request with the same number of issue number', async () => {
      const { methods } = await getContract(thunder, web3)

      const expErr = 'revert'
      const testRepoOwner = 'allemanfredi'
      const testRepoName = 'test'
      const testIssueNumber = 1
      const invalidTestPullRequestNumber = 1
      const testPullRequestCreator = 'pullRequestCreator'
      const testIssueBounty = 100

      const paramsForCreatingRepo = [testRepoOwner, testRepoName]
      const paramsForCreatingIssue = [
        testRepoOwner,
        testRepoName,
        testIssueNumber
      ]
      const params = [
        testRepoOwner,
        testRepoName,
        testIssueNumber,
        invalidTestPullRequestNumber,
        testPullRequestCreator
      ]

      await methods.newRepo(...paramsForCreatingRepo).send({
        from: ACCOUNT_1,
        gas: GAS_LIMIT
      })

      await methods.newIssue(...paramsForCreatingIssue).send({
        from: ACCOUNT_1,
        gas: GAS_LIMIT,
        value: testIssueBounty
      })

      try {
        await methods.newPullRequest(...params).send({
          from: ACCOUNT_2,
          gas: GAS_LIMIT
        })

        assert.fail(
          'It is not possible to create a pull request with the same number of issue id'
        )
      } catch (err) {
        assert.isTrue(
          err.message.startsWith(`${ERROR_PREFIX}${expErr}`),
          `Expected ${expErr} but got ${err.message} instead!`
        )
      }
    })

    it('Should not create a new pull request on a not existing issue', async () => {
      const { methods } = await getContract(thunder, web3)

      const expErr = 'revert'
      const testRepoOwner = 'allemanfredi'
      const testRepoName = 'test'
      const testIssueNumber = 1
      const testPullRequestNumber = 2
      const invalidIssueNumber = 2
      const testPullRequestCreator = 'pullRequestCreator'
      const testIssueBounty = 100

      const paramsForCreatingRepo = [testRepoOwner, testRepoName]
      const paramsForCreatingIssue = [
        testRepoOwner,
        testRepoName,
        testIssueNumber
      ]
      const params = [
        testRepoOwner,
        testRepoName,
        invalidIssueNumber,
        testPullRequestNumber,
        testPullRequestCreator
      ]

      await methods.newRepo(...paramsForCreatingRepo).send({
        from: ACCOUNT_1,
        gas: GAS_LIMIT
      })

      await methods.newIssue(...paramsForCreatingIssue).send({
        from: ACCOUNT_1,
        gas: GAS_LIMIT,
        value: testIssueBounty
      })

      try {
        await methods.newPullRequest(...params).send({
          from: ACCOUNT_2,
          gas: GAS_LIMIT
        })

        assert.fail(
          'It is not possible to create a pull request on a not existing issue'
        )
      } catch (err) {
        assert.isTrue(
          err.message.startsWith(`${ERROR_PREFIX}${expErr}`),
          `Expected ${expErr} but got ${err.message} instead!`
        )
      }
    })

    it('Same user should not create more than one pull request on the same issue', async () => {
      const { methods } = await getContract(thunder, web3)

      const expErr = 'revert'
      const testRepoOwner = 'allemanfredi'
      const testRepoName = 'test'
      const testIssueNumber = 1
      const testPullRequestNumber = 2
      const testPullRequestCreator = 'pullRequestCreator'
      const testIssueBounty = 100

      const paramsForCreatingRepo = [testRepoOwner, testRepoName]
      const paramsForCreatingIssue = [
        testRepoOwner,
        testRepoName,
        testIssueNumber
      ]
      const params = [
        testRepoOwner,
        testRepoName,
        testIssueNumber,
        testPullRequestNumber,
        testPullRequestCreator
      ]

      await methods.newRepo(...paramsForCreatingRepo).send({
        from: ACCOUNT_1,
        gas: GAS_LIMIT
      })

      await methods.newIssue(...paramsForCreatingIssue).send({
        from: ACCOUNT_1,
        gas: GAS_LIMIT,
        value: testIssueBounty
      })

      await methods.newPullRequest(...params).send({
        from: ACCOUNT_2,
        gas: GAS_LIMIT
      })

      try {
        await methods.newPullRequest(...params).send({
          from: ACCOUNT_2,
          gas: GAS_LIMIT
        })

        assert.fail(
          'Same user can not create more than one pull request on the same issue'
        )
      } catch (err) {
        assert.isTrue(
          err.message.startsWith(`${ERROR_PREFIX}${expErr}`),
          `Expected ${expErr} but got ${err.message} instead!`
        )
      }
    })

    it('More than one should be able to create a pull request on the same issue', async () => {
      const { methods, events } = await getContract(thunder, web3)

      const testRepoOwner = 'allemanfredi'
      const testRepoName = 'test'
      const testIssueNumber = 1
      const testPullRequestNumber1 = 2
      const testPullRequestNumber2 = 3
      const testPullRequestCreator1 = 'pullRequestCreator1'
      const testPullRequestCreator2 = 'pullRequestCreator2'
      const testIssueBounty = 100

      const paramsForCreatingRepo = [testRepoOwner, testRepoName]
      const paramsForCreatingIssue = [
        testRepoOwner,
        testRepoName,
        testIssueNumber
      ]
      const paramsForCreatingFirtPullRequest = [
        testRepoOwner,
        testRepoName,
        testIssueNumber,
        testPullRequestNumber1,
        testPullRequestCreator1
      ]

      const paramsForCreatingSecondPullRequest = [
        testRepoOwner,
        testRepoName,
        testIssueNumber,
        testPullRequestNumber2,
        testPullRequestCreator2
      ]

      await methods.newRepo(...paramsForCreatingRepo).send({
        from: ACCOUNT_1,
        gas: GAS_LIMIT
      })

      await methods.newIssue(...paramsForCreatingIssue).send({
        from: ACCOUNT_1,
        gas: GAS_LIMIT,
        value: testIssueBounty
      })

      await methods.newPullRequest(...paramsForCreatingFirtPullRequest).send({
        from: ACCOUNT_2,
        gas: GAS_LIMIT
      })

      await methods.newPullRequest(...paramsForCreatingSecondPullRequest).send({
        from: ACCOUNT_3,
        gas: GAS_LIMIT
      })

      const {
        returnValues: {
          pullRequestCreatorName,
          repoOwner,
          repoName,
          pullRequestNumber,
          issueNumber
        }
      } = await waitForEvent(events.NewPullRequest, null, 'latest')

      assert.strictEqual(pullRequestCreatorName, testPullRequestCreator2)
      assert.strictEqual(repoOwner, testRepoOwner)
      assert.strictEqual(repoName, testRepoName)
      assert.strictEqual(parseInt(pullRequestNumber), testPullRequestNumber2)
      assert.strictEqual(parseInt(issueNumber), 1)
    })

    it('Repo owner should accept the second pull request', async () => {
      const { methods, events } = await getContract(thunder, web3)

      const testRepoOwner = 'allemanfredi'
      const testRepoName = 'test'
      const testIssueNumber = 1
      const testPullRequestNumber1 = 2
      const testPullRequestNumber2 = 3
      const testPullRequestCreator1 = 'pullRequestCreator1'
      const testPullRequestCreator2 = 'pullRequestCreator2'
      const testIssueBounty = 100

      const paramsForCreatingRepo = [testRepoOwner, testRepoName]
      const paramsForCreatingIssue = [
        testRepoOwner,
        testRepoName,
        testIssueNumber
      ]
      const paramsForCreatingFirtPullRequest = [
        testRepoOwner,
        testRepoName,
        testIssueNumber,
        testPullRequestNumber1,
        testPullRequestCreator1
      ]
      const paramsForCreatingSecondPullRequest = [
        testRepoOwner,
        testRepoName,
        testIssueNumber,
        testPullRequestNumber2,
        testPullRequestCreator2
      ]
      const params = [
        testRepoOwner,
        testRepoName,
        testIssueNumber,
        testPullRequestNumber2,
        ACCOUNT_3
      ]

      await methods.newRepo(...paramsForCreatingRepo).send({
        from: ACCOUNT_1,
        gas: GAS_LIMIT
      })

      await methods.newIssue(...paramsForCreatingIssue).send({
        from: ACCOUNT_1,
        gas: GAS_LIMIT,
        value: testIssueBounty
      })

      await methods.newPullRequest(...paramsForCreatingFirtPullRequest).send({
        from: ACCOUNT_2,
        gas: GAS_LIMIT
      })

      await methods.newPullRequest(...paramsForCreatingSecondPullRequest).send({
        from: ACCOUNT_3,
        gas: GAS_LIMIT
      })

      await methods.acceptPullRequest(...params).send({
        from: ACCOUNT_1,
        gas: GAS_LIMIT
      })

      const {
        returnValues: {
          repoName,
          repoOwner,
          pullRequestCreatorName,
          issueNumber,
          pullRequestNumber
        }
      } = await waitForEvent(events.NewAcceptedPullRequested, null, 'latest')

      assert.strictEqual(repoOwner, testRepoOwner)
      assert.strictEqual(repoName, testRepoName)
      assert.strictEqual(pullRequestCreatorName, testPullRequestCreator2)
      assert.strictEqual(parseInt(issueNumber), 1)
      assert.strictEqual(parseInt(pullRequestNumber), testPullRequestNumber2)
    })

    it('Repo owner should not accept pull request not performed', async () => {
      const { methods } = await getContract(thunder, web3)

      const expErr = 'revert'
      const testRepoOwner = 'allemanfredi'
      const testRepoName = 'test'
      const testIssueNumber = 1
      const testPullRequestNumber1 = 2
      const pullRequestNumberNotPerformed = 3
      const testPullRequestCreator1 = 'pullRequestCreator1'
      const testIssueBounty = 100

      const paramsForCreatingRepo = [testRepoOwner, testRepoName]
      const paramsForCreatingIssue = [
        testRepoOwner,
        testRepoName,
        testIssueNumber
      ]
      const paramsForCreatingFirtPullRequest = [
        testRepoOwner,
        testRepoName,
        testIssueNumber,
        testPullRequestNumber1,
        testPullRequestCreator1
      ]
      const params = [
        testRepoOwner,
        testRepoName,
        testIssueNumber,
        pullRequestNumberNotPerformed,
        ACCOUNT_3
      ]

      await methods.newRepo(...paramsForCreatingRepo).send({
        from: ACCOUNT_1,
        gas: GAS_LIMIT
      })

      await methods.newIssue(...paramsForCreatingIssue).send({
        from: ACCOUNT_1,
        gas: GAS_LIMIT,
        value: testIssueBounty
      })

      await methods.newPullRequest(...paramsForCreatingFirtPullRequest).send({
        from: ACCOUNT_2,
        gas: GAS_LIMIT
      })

      try {
        await methods.acceptPullRequest(...params).send({
          from: ACCOUNT_1,
          gas: GAS_LIMIT
        })
        assert.fail('It is not possible to accept pull request not performed')
      } catch (err) {
        assert.isTrue(
          err.message.startsWith(`${ERROR_PREFIX}${expErr}`),
          `Expected ${expErr} but got ${err.message} instead!`
        )
      }
    })

    it('Repo owner should not accept other pull request if the corresponding issue is closed', async () => {
      const { methods } = await getContract(thunder, web3)

      const expErr = 'revert'
      const testRepoOwner = 'allemanfredi'
      const testRepoName = 'test'
      const testIssueNumber = 1
      const testPullRequestNumber1 = 2
      const testPullRequestNumber2 = 3
      const testPullRequestCreator1 = 'pullRequestCreator1'
      const testPullRequestCreator2 = 'pullRequestCreator2'
      const testIssueBounty = 100

      const paramsForCreatingRepo = [testRepoOwner, testRepoName]
      const paramsForCreatingIssue = [
        testRepoOwner,
        testRepoName,
        testIssueNumber
      ]
      const paramsForCreatingFirtPullRequest = [
        testRepoOwner,
        testRepoName,
        testIssueNumber,
        testPullRequestNumber1,
        testPullRequestCreator1
      ]
      const paramsForCreatingSecondPullRequest = [
        testRepoOwner,
        testRepoName,
        testIssueNumber,
        testPullRequestNumber2,
        testPullRequestCreator2
      ]
      const paramsForAcceptingPullRequest = [
        testRepoOwner,
        testRepoName,
        testIssueNumber,
        testPullRequestNumber2,
        ACCOUNT_3
      ]
      const paramsForNotAcceptingPullRequest = [
        testRepoOwner,
        testRepoName,
        testIssueNumber,
        testPullRequestNumber1,
        ACCOUNT_2
      ]

      await methods.newRepo(...paramsForCreatingRepo).send({
        from: ACCOUNT_1,
        gas: GAS_LIMIT
      })

      await methods.newIssue(...paramsForCreatingIssue).send({
        from: ACCOUNT_1,
        gas: GAS_LIMIT,
        value: testIssueBounty
      })

      await methods.newPullRequest(...paramsForCreatingFirtPullRequest).send({
        from: ACCOUNT_2,
        gas: GAS_LIMIT
      })

      await methods.newPullRequest(...paramsForCreatingSecondPullRequest).send({
        from: ACCOUNT_3,
        gas: GAS_LIMIT
      })

      await methods.acceptPullRequest(...paramsForAcceptingPullRequest).send({
        from: ACCOUNT_1,
        gas: GAS_LIMIT
      })

      try {
        await methods
          .acceptPullRequest(...paramsForNotAcceptingPullRequest)
          .send({
            from: ACCOUNT_1,
            gas: GAS_LIMIT
          })

        assert.fail(
          'Impossible to accept a pull request on an issue already closed'
        )
      } catch (err) {
        assert.isTrue(
          err.message.startsWith(`${ERROR_PREFIX}${expErr}`),
          `Expected ${expErr} but got ${err.message} instead!`
        )
      }
    })
  }
)
