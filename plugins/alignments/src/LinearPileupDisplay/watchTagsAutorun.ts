import { getContainingView } from '@jbrowse/core/util'

import { LinearGenomeViewModel } from '@jbrowse/plugin-linear-genome-view'
// locals
import { getUniqueTagValues } from '../shared'
import { createAutorun } from '../util'
import { LinearPileupDisplayModel } from './model'

export function watchTagsAutorun(self: LinearPileupDisplayModel) {
  createAutorun(
    self,
    async () => {
      const view = getContainingView(self) as LinearGenomeViewModel
      if (!self.autorunReady) {
        return
      }

      const { colorBy } = self
      const { staticBlocks } = view
      if (colorBy?.tag) {
        const vals = await getUniqueTagValues(self, colorBy, staticBlocks)
        self.updateColorTagMap(vals)
      }
      self.setTagsReady(true)
    },
    { delay: 1000 },
  )
}
