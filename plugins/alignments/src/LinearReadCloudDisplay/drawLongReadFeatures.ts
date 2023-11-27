import { getConf } from '@jbrowse/core/configuration'
import { max, min } from '@jbrowse/core/util'
import { Assembly } from '@jbrowse/core/assemblyManager/assembly'
import { LinearGenomeViewModel } from '@jbrowse/plugin-linear-genome-view'

// locals
import { FeatureData } from '../shared/fetchFeatures'
import { LinearReadCloudDisplayModel } from './model'
import { fillColor, strokeColor } from '../shared/color'
import { fillRectCtx, strokeRectCtx } from './util'

export function drawLongReadFeatures({
  ctx,
  model,
  featureData,
  view,
  asm,
}: {
  ctx: CanvasRenderingContext2D
  model: LinearReadCloudDisplayModel
  featureData: FeatureData
  view: LinearGenomeViewModel
  asm: Assembly
}) {
  const distances: number[] = []
  const minXs: number[] = []
  const { chains } = featureData
  const { height } = model
  const featureHeight = getConf(model, 'featureHeight')

  // get bounds on the 'distances' (pixel span that a particular split long
  // read 'feature' would have in view)
  for (const feature of chains) {
    let minX = Number.MAX_VALUE
    let maxX = Number.MIN_VALUE
    for (const elt of feature) {
      const refName = asm.getCanonicalRefName(elt.refName) || elt.refName
      const rs = view.bpToPx({ refName, coord: elt.start })?.offsetPx
      const re = view.bpToPx({ refName, coord: elt.end })?.offsetPx
      if (rs !== undefined && re !== undefined) {
        minX = Math.min(minX, rs)
        maxX = Math.max(maxX, re)
      }
    }
    const distance = Math.abs(maxX - minX)
    distances.push(distance)
    minXs.push(minX)
  }

  const maxD = Math.log(max(distances))
  const minD = Math.max(Math.log(min(distances)) - 1, 0)
  const scaler = (height - 20) / (maxD - minD)
  const halfHeight = featureHeight / 2 - 0.5

  // draw split long read 'features' as connected entities
  for (let i = 0; i < chains.length; i++) {
    const feature = chains[i]
    const w = distances[i]
    const top = (Math.log(w) - minD) * scaler
    const min = minXs[i]
    fillRectCtx(min - view.offsetPx, top + halfHeight, w, 1, ctx, 'black')
    const c1 = feature[0]
    let primaryStrand: undefined | number
    if (!(c1.flags & 2048)) {
      primaryStrand = c1.strand
    } else {
      const res = c1.SA?.split(';')[0].split(',')[2]
      primaryStrand = res === '-' ? -1 : 1
    }
    for (const v0 of feature) {
      const ra = asm.getCanonicalRefName(v0.refName) || v0.refName
      const rs = view.bpToPx({ refName: ra, coord: v0.start })?.offsetPx
      const re = view.bpToPx({ refName: ra, coord: v0.end })?.offsetPx
      if (rs !== undefined && re !== undefined) {
        const w = Math.max(re - rs, 2)
        const l = rs - view.offsetPx
        const effectiveStrand = v0.strand * primaryStrand
        const c =
          effectiveStrand === -1 ? 'color_rev_strand' : 'color_fwd_strand'
        strokeRectCtx(l, top, w, featureHeight, ctx, strokeColor[c])
        fillRectCtx(l, top, w, featureHeight, ctx, fillColor[c])
      }
    }
  }
}
