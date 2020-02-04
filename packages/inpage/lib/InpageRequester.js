import randomUUID from 'uuid/v4'

class InpageRequester {
  constructor(inpageStream) {
    this.inpageStream = inpageStream
    this.calls = {}

    this._registerInpageStreamListener()
  }

  _registerInpageStreamListener() {
    this.inpageStream.on('data', ({ success, data, uuid }) => {
      if (success) this.calls[uuid].resolve(data)
      else this.calls[uuid].reject(data)

      delete this.calls[uuid]
    })
  }

  send(action, data = {}) {
    const uuid = randomUUID()

    this.inpageStream.write({
      action,
      data,
      uuid
    })

    return new Promise((resolve, reject) => {
      this.calls[uuid] = {
        resolve,
        reject
      }
    })
  }
}

export default InpageRequester
