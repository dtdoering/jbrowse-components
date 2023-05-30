// locals
import { LinearPileupDisplayModel } from './model'
import { watchModificationsAutorun } from './watchModificationsAutorun'
import { watchTagsAutorun } from './watchTagsAutorun'
import { watchSortAutorun } from './watchSortAutorun'
import { watchFeatureUnderMouseAutorun } from './watchFeatureUnderMouseAutorun'
import { drawTrackAutorun } from '../shared/drawTrackAutorun'
import { drawPileup } from './drawPileup'

export function linearPileupAfterAttach(self: LinearPileupDisplayModel) {
  drawTrackAutorun(self, drawPileup)
  // watchModificationsAutorun(self)
  watchTagsAutorun(self)
  // watchSortAutorun(self)
  watchFeatureUnderMouseAutorun(self)
}
