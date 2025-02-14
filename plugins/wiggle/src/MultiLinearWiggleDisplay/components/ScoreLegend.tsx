import React from 'react'
import { measureText, getContainingView } from '@jbrowse/core/util'
import { LinearGenomeViewModel } from '@jbrowse/plugin-linear-genome-view'
import { observer } from 'mobx-react'

// locals
import { WiggleDisplayModel } from '../models/model'
import RectBg from './RectBg'

type LGV = LinearGenomeViewModel

const ScoreLegend = observer(({ model }: { model: WiggleDisplayModel }) => {
  const { ticks, scaleType } = model
  const { width } = getContainingView(model) as LGV
  const legend =
    `[${ticks?.values[0]}-${ticks?.values[1]}]` +
    (scaleType === 'log' ? ' (log scale)' : '')
  const len = measureText(legend, 14)
  const padding = 25
  const xpos = width - len - padding
  return (
    <>
      <RectBg y={0} x={xpos} width={len + 6} height={16} />
      <text y={13} x={xpos}>
        {legend}
      </text>
    </>
  )
})

export default ScoreLegend
