import Duplex from '@thunder/lib/Duplex'
import axios from 'axios'

const duplex = new Duplex.Host()

const backgroundScript = {

  run () {
    this.bindPopupDuplex()
    this.bindTabDuplex()
  },

  bindPopupDuplex () {
    // duplex.on('eventName', this.doSomething)
  },

  bindTabDuplex () {
    duplex.on('tabRequest', async ({ resolve, data: { action, data, uuid, website } }) => {
      switch (action) {
        case 'init': {
          // do somenthing

          resolve({
            success: true,
            data: null,
            uuid
          })
          break
        }

        case 'getAccountInfo': {
          const res = await axios.get(`https://api.github.com/users/${data.username}`)
          resolve({
            success: true,
            data: res.data,
            uuid
          })
          break
        }
        case 'getRepoInfo': {
          const res = await axios.get(`https://api.github.com/repos/${data.repo}`)
          resolve({
            success: true,
            data: res.data,
            uuid
          })
          break
        }
        case 'getRepoIssues': {
          const res = await axios.get(`https://api.github.com/repos/${data.repo}/issues?state=all`)

          resolve({
            success: true,
            data: res.data,
            uuid
          })
          break
        }
      }
    })
  }
}

backgroundScript.run()
