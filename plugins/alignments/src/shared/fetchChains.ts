import {
  getContainingTrack,
  getContainingView,
  getSession,
} from '@jbrowse/core/util'
import { getSnapshot } from 'mobx-state-tree'
import { LinearGenomeViewModel } from '@jbrowse/plugin-linear-genome-view'

// locals
import { LinearReadArcsDisplayModel } from '../LinearReadArcsDisplay/model'
import { LinearReadCloudDisplayModel } from '../LinearReadCloudDisplay/model'
import { createAutorun } from '../util'

type LGV = LinearGenomeViewModel

export interface ReducedFeature {
  name: string
  strand: number
  refName: string
  start: number
  end: number
  id: string
  flags: number
  tlen: number
  pair_orientation: string
  next_ref?: string
  next_pos?: number
  clipPos: number
  SA?: string
}

export interface ChainStats {
  max: number
  min: number
  upper: number
  lower: number
}

export interface ChainData {
  chains: ReducedFeature[][]
  stats?: ChainStats
}

type AnyDisplay = LinearReadArcsDisplayModel | LinearReadCloudDisplayModel

export async function fetchChains(self: AnyDisplay) {
  const { rpcSessionId: sessionId } = getContainingTrack(self)
  const { rpcManager } = getSession(self)
  const view = getContainingView(self) as LGV

  if (!view.initialized || self.error || self.regionTooLarge) {
    return
  }

  self.setLoading(true)
  const ret = (await rpcManager.call(sessionId, 'PileupGetReducedFeatures', {
    sessionId,
    regions: view.staticBlocks.contentBlocks,
    filterBy: getSnapshot(self.filterBy),
    adapterConfig: self.adapterConfig,
  })) as ChainData

  self.setChainData(ret)
  self.setLoading(false)
}

export function fetchChainsAutorun(self: AnyDisplay) {
  createAutorun(
    self,
    async () => {
      await fetchChains(self)
    },
    { delay: 1000 },
  )
}
