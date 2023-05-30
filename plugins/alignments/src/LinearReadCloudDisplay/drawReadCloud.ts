import { getContainingView, getSession } from '@jbrowse/core/util'
import { LinearGenomeViewModel } from '@jbrowse/plugin-linear-genome-view'

// locals
import { LinearReadCloudDisplayModel } from './model'
import { hasPairedReads } from '../shared/util'
import { drawPairChains } from './drawPairChains'
import { drawLongReadChains } from './drawLongReadChains'

export function drawReadCloud(
  self: LinearReadCloudDisplayModel,
  ctx: CanvasRenderingContext2D,
) {
  const { chainData } = self
  if (!chainData) {
    return
  }
  const { assemblyManager } = getSession(self)
  const view = getContainingView(self) as LinearGenomeViewModel
  const assemblyName = view.assemblyNames[0]
  const asm = assemblyManager.get(assemblyName)
  if (!asm) {
    return
  }

  if (hasPairedReads(chainData)) {
    drawPairChains({ self, view, asm, ctx, chainData })
  } else {
    drawLongReadChains({ self, view, asm, ctx, chainData })
  }
}
