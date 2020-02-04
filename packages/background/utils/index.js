const requestHandler = target => {
  return new Proxy(target, {
    get(target, prop) {
      if (!Reflect.has(target, prop))
        throw new Error(`Object does not have property '${prop}'`)

      if (typeof target[prop] !== 'function' || prop === 'on')
        return Reflect.get(target, prop)

      return (...args) => {
        if (!args.length) args[0] = {}

        const [firstArg] = args

        const {
          resolve = () => {},
          reject = ex => console.error(ex),
          data
        } = firstArg

        if (typeof firstArg !== 'object' || !('data' in firstArg))
          return target[prop].call(target, ...args)

        Promise.resolve(target[prop].call(target, data))
          .then(resolve)
          .catch(reject)
      }
    }
  })
}

export default requestHandler
