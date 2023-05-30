import { getConf } from '@jbrowse/core/configuration'
import { getContainingView } from '@jbrowse/core/util'

import { LinearGenomeViewModel } from '@jbrowse/plugin-linear-genome-view'
// locals
import { getUniqueModificationValues } from '../shared'
import { createAutorun } from '../util'
import { LinearPileupDisplayModel } from './model'

export function watchModificationsAutorun(self: LinearPileupDisplayModel) {
  createAutorun(self, async () => {
    if (!self.autorunReady) {
      return
    }
    const { parentTrack, colorBy } = self
    const { staticBlocks } = getContainingView(self) as LinearGenomeViewModel
    if (colorBy?.type === 'modifications') {
      const adapter = getConf(parentTrack, ['adapter'])
      const vals = await getUniqueModificationValues(
        self,
        adapter,
        colorBy,
        staticBlocks,
      )
      self.updateModificationColorMap(vals)
    }
    self.setModificationsReady(true)
  })
}
