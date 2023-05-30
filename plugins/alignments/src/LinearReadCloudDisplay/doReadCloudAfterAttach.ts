import { drawTrackAutorun } from '../shared/drawTrackAutorun'
import { fetchChainsAutorun } from '../shared/fetchChains'
import { drawReadCloud } from './drawReadCloud'
import { LinearReadCloudDisplayModel } from './model'

export function doReadCloudAutorun(self: LinearReadCloudDisplayModel) {
  fetchChainsAutorun(self)
  drawTrackAutorun(self, drawReadCloud)
}
