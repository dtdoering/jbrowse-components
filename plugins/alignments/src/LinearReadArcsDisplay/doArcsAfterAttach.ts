import { drawTrackAutorun } from '../shared/drawTrackAutorun'
import { fetchChainsAutorun } from '../shared/fetchChains'
import { drawArcs } from './drawArcs'
import { LinearReadArcsDisplayModel } from './model'

export function doArcsAfterAttach(self: LinearReadArcsDisplayModel) {
  fetchChainsAutorun(self)
  drawTrackAutorun(self, drawArcs)
}
