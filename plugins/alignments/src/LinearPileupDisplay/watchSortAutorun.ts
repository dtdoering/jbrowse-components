import { getRpcSessionId } from '@jbrowse/core/util/tracks'
import { getSession, getContainingView } from '@jbrowse/core/util'

import { LinearGenomeViewModel } from '@jbrowse/plugin-linear-genome-view'
// locals
import { createAutorun } from '../util'
import { LinearPileupDisplayModel } from './model'

export function watchSortAutorun(self: LinearPileupDisplayModel) {
  createAutorun(
    self,
    async () => {
      const { rpcManager } = getSession(self)
      const view = getContainingView(self) as LinearGenomeViewModel
      if (!self.autorunReady) {
        return
      }

      const { sortedBy, adapterConfig, rendererType } = self
      const { bpPerPx } = view

      if (sortedBy) {
        const { pos, refName, assemblyName } = sortedBy
        // render just the sorted region first
        // @ts-expect-error
        await self.rendererType.renderInClient(rpcManager, {
          assemblyName,
          regions: [
            {
              start: pos,
              end: pos + 1,
              refName,
              assemblyName,
            },
          ],
          adapterConfig,
          rendererType: rendererType.name,
          sessionId: getRpcSessionId(self),
          layoutId: view.id,
          timeout: 1_000_000,
          ...self.renderPropsPre(),
        })
      }
      self.setCurrSortBpPerPx(bpPerPx)
      self.setSortReady(true)
    },
    { delay: 1000 },
  )
}
