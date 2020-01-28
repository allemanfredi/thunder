import React, { Component } from 'react'

import Main from './main/Main'

class App extends Component {

	constructor(props, context) {
		super(props, context)

	}

	render() {
		return (
			<div className="app-wrapper">
				<div className="app chrome">
					<Main />
				</div>
			</div>

		)
	}
}

export default App
