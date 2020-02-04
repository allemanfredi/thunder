import { backgroundMessanger } from '@thunder/lib/messangers'
import GithubApiController from './controllers/github-api-controller'
import PersistenceStorageController from './controllers/persistence-global-state-controller'

class Thunder {
  constructor(duplex) {
    backgroundMessanger.init(duplex)

    this.githubApiController = new GithubApiController()
    this.persistenceStorageController = new PersistenceStorageController()
  }

  getGlobalState() {
    return this.persistenceStorageController.state
  }

  changeEnabling(_isEnabled) {
    this.persistenceStorageController.changeEnabling(_isEnabled)
  }
}

export default Thunder
