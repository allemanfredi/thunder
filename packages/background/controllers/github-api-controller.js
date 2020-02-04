import axios from 'axios'

class GithubApiController {
  constructor() {}

  getAccountInfo(_username) {
    return new Promise((resolve, reject) => {
      axios
        .get(`https://api.github.com/users/${_username}`)
        .then(_res => resolve(_res.data))
        .catch(_err => reject(err))
    })
  }

  getRepoInfo(_repo) {
    return new Promise((resolve, reject) => {
      axios
        .get(`https://api.github.com/repos/${_repo}`)
        .then(_res => resolve(_res.data))
        .catch(_err => reject(err))
    })
  }

  getRepoIssues(_repo) {
    return new Promise((resolve, reject) => {
      axios
        .get(`https://api.github.com/repos/${_repo}/issues?state=all`)
        .then(_res => resolve(_res.data))
        .catch(_err => reject(err))
    })
  }
}

export default GithubApiController
