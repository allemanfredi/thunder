import { backgroundMessanger } from '@thunder/lib/messangers'
import GithubApiController from './controllers/github-api-controller'
import PersistenceGlobalStateController from './controllers/persistence-global-state-controller'

class Thunder {
  constructor(duplex) {
    backgroundMessanger.init(duplex)

    this.githubApiController = new GithubApiController()
    this.persistenceStorageController = new PersistenceGlobalStateController()
  }

  getGlobalState() {
    return this.persistenceGlobalStateController.state
  }

  changeEnabling(_isEnabled) {
    this.persistenceGlobalStateController.changeEnabling(_isEnabled)
  }
}

export default Thunder
