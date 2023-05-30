import { lazy } from 'react'
import DisplayType from '@jbrowse/core/pluggableElementTypes/DisplayType'
import PluginManager from '@jbrowse/core/PluginManager'

// locals
import stateModelFactory from './model'
import configSchemaFactory from './configSchema'

export default function register(pluginManager: PluginManager) {
  pluginManager.addDisplayType(() => {
    const configSchema = configSchemaFactory(pluginManager)
    return new DisplayType({
      name: 'LinearPileupDisplay',
      displayName: 'Pileup display',
      configSchema,
      stateModel: stateModelFactory(configSchema),
      subDisplay: { type: 'LinearAlignmentsDisplay', lowerPanel: true },
      trackType: 'AlignmentsTrack',
      viewType: 'LinearGenomeView',
      ReactComponent: lazy(() => import('./components/ReactComponent')),
    })
  })
}

export { default as linearPileupDisplayStateModelFactory } from './model'
export { default as linearPileupDisplayConfigSchemaFactory } from './configSchema'
export { SharedLinearPileupDisplayMixin } from './SharedLinearPileupDisplayMixin'
