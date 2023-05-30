import { getSnapshot } from 'mobx-state-tree'
import {
  getContainingTrack,
  getContainingView,
  getSession,
} from '@jbrowse/core/util'

// locals
import { LinearPileupDisplayModel } from './model'

export async function drawPileup(
  self: LinearPileupDisplayModel,
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  const { rendererType, adapterConfig } = self
  const { rpcManager } = getSession(self)
  const { rpcSessionId: sessionId } = getContainingTrack(self)
  const { displayModel, ...rest } = self.renderProps()
  const view = getContainingView(self)
  const layoutId = view.id
  // @ts-expect-error
  const ret = await rendererType.renderInClient(rpcManager, {
    sessionId,
    layoutId,
    adapterConfig,
    rendererType: rendererType.name,
    displayModel: getSnapshot(displayModel),
    regions: view.dynamicBlocks.contentBlocks,
    ...rest,
  })

  ctx.clearRect(0, 0, width, height * 2)
  ctx.drawImage(ret.imageData, 0, 0)
  self.setLastDrawn(view.offsetPx, view.bpPerPx)
}
