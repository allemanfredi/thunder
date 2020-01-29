import InpageRequester from './lib/InpageRequester'
import Layouter from './pages'
import PostMessageStream from 'post-message-stream'

const inpageStream = new PostMessageStream({
  name: 'thunderInpage',
  target: 'thunderContentScript'
})
const inpageRequester = new InpageRequester(inpageStream)

Layouter.init(window.location.href, inpageRequester)
