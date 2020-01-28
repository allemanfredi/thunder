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
		window.addEventListener('message', ({ data: { isThunder = false, message, source } }) => {

			if (!isThunder || (!message && !source))
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
			isThunder: true
		}, '*')
	}
}

export default EventChannel