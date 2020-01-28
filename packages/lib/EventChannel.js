import EventEmitter from 'eventemitter3'

class EventChannel extends EventEmitter {
	constructor(channelKey = false) {
		super()

		if (!channelKey)
			throw 'No channel scope provided'

		this._channelKey = channelKey
		this._registerEventListener()
	}

	_registerEventListener() {
		window.addEventListener('message', ({ data: { isGCE = false, message, source } }) => {

			if (!isGCE || (!message && !source))
				return

			if (source === this._channelKey)
				return

			const {
				action,
				data
			} = message

			this.emit(action, data)
		})
	}

	send(action = false, data = {}) {
		if (!action)
			return { success: false, error: 'Function requires action {string} parameter' }

		data = JSON.parse(JSON.stringify(data))
		window.postMessage({
			message: {
				action,
				data
			},
			source: this._channelKey,
			isGCE: true
		}, '*')
	}
}

export default EventChannel