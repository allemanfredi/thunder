import Duplex from '@thunder/lib/Duplex'
import Thunder from './thunder'
import requestHandler from './utils/'

const duplex = new Duplex.Host()

const thunder = requestHandler(new Thunder(duplex))

const bindPopupDuplex = () => {
  duplex.on('getGlobalState', thunder.getGlobalState)
  duplex.on('changeEnabling', thunder.changeEnabling)
}

const bindTabDuplex = () => {
  duplex.on('tabRequest', async ({ resolve, data: { action, data, uuid } }) => {
    switch (action) {
      case 'isEnabled': {
        const isEnabled = await thunder.isEnabled()
        resolve({
          success: true,
          data: isEnabled,
          uuid
        })
        break
      }
      case 'getAccountInfo': {
        const accountInfo = await thunder.githubApiController.getAccountInfo(
          data.username
        )
        resolve({
          success: true,
          data: accountInfo,
          uuid
        })
        break
      }
      case 'getRepoInfo': {
        const repoInfo = await thunder.githubApiController.getRepoInfo(
          data.repo
        )
        resolve({
          success: true,
          data: repoInfo,
          uuid
        })
        break
      }
      case 'getRepoIssues': {
        const repoIssues = await thunder.githubApiController.getRepoIssues(
          data.repo
        )
        resolve({
          success: true,
          data: repoIssues,
          uuid
        })
        break
      }
    }
  })
}

bindTabDuplex()
bindPopupDuplex()
