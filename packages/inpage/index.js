import InpageRequester from './lib/InpageRequester'
import Layouter from './pages'
import PostMessageStream from 'post-message-stream'

const inpageStream = new PostMessageStream({
  name: 'thunderInpage',
  target: 'thunderContentScript'
})
const inpageRequester = new InpageRequester(inpageStream)
const layouter = new Layouter(window.location.href, inpageRequester)

const start = async () => {
  const isThunderEnabled = await inpageRequester.send('isEnabled')
  if (isThunderEnabled) layouter.injectElements()
}

start()
