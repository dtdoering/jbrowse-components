import { readConfObject } from '@jbrowse/core/configuration'
import { bpToPx } from '@jbrowse/core/util'
import { observer } from 'mobx-react'

// locals
import Lollipop from './Lollipop'
import Stick from './Stick'

function LollipopRendering(props) {
  const onMouseDown = event => {
    const { onMouseDown: handler } = props
    if (!handler) {
      return undefined
    }
    return handler(event)
  }

  const onMouseUp = event => {
    const { onMouseUp: handler } = props
    if (!handler) {
      return undefined
    }
    return handler(event)
  }

  const onMouseEnter = event => {
    const { onMouseEnter: handler } = props
    if (!handler) {
      return undefined
    }
    return handler(event)
  }

  const onMouseLeave = event => {
    const { onMouseLeave: handler } = props
    if (!handler) {
      return undefined
    }
    return handler(event)
  }

  const onMouseOver = event => {
    const { onMouseOver: handler } = props
    if (!handler) {
      return undefined
    }
    return handler(event)
  }

  const onMouseOut = event => {
    const { onMouseOut: handler } = props
    if (!handler) {
      return undefined
    }
    return handler(event)
  }

  const onClick = event => {
    const { onClick: handler } = props
    if (!handler) {
      return undefined
    }
    return handler(event)
  }

  function layoutFeat(args) {
    const { feature, bpPerPx, region, layout } = args

    const centerBp = Math.abs(feature.get('end') + feature.get('start')) / 2
    const centerPx = bpToPx(centerBp, region, bpPerPx)
    const radiusPx = readConfObject(args.config, 'radius', { feature })

    if (!radiusPx) {
      console.error(
        new Error(
          `lollipop radius ${radiusPx} configured for feature ${feature.id()}`,
        ),
      )
    }
    layout.add(feature.id(), centerPx, radiusPx * 2, radiusPx * 2, {
      featureId: feature.id(),
      anchorX: centerPx,
      radiusPx,
      score: readConfObject(args.config, 'score', { feature }),
    })
  }

  const {
    regions,
    bpPerPx,
    layout,
    config,
    features = new Map(),
    displayModel: { selectedFeatureId } = {},
  } = props

  const [region] = regions
  const sticksRendered = []
  const lollipopsRendered = []
  for (const feature of features.values()) {
    layoutFeat({
      feature,
      bpPerPx,
      region,
      config,
      layout,
    })
  }

  for (const layoutRecord of layout.getLayout(config).values()) {
    const feature = features.get(layoutRecord.data.featureId)
    lollipopsRendered.push(
      <Stick
        {...props}
        layoutRecord={layoutRecord}
        feature={feature}
        key={`stick-${feature.id()}`}
        selectedFeatureId={selectedFeatureId}
      />,
    )
  }

  for (const layoutRecord of layout.getLayout(config).values()) {
    const feature = features.get(layoutRecord.data.featureId)
    lollipopsRendered.push(
      <Lollipop
        {...props}
        layoutRecord={layoutRecord}
        feature={feature}
        key={`body-${feature.id()}`}
        selectedFeatureId={selectedFeatureId}
      />,
    )
  }

  const width = (region.end - region.start) / bpPerPx
  const height = layout.getTotalHeight()

  return (
    <svg
      className="LollipopRendering"
      width={width}
      height={height}
      style={{
        position: 'relative',
      }}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      onFocus={onMouseEnter}
      onBlur={onMouseLeave}
      onClick={onClick}
    >
      {sticksRendered}
      {lollipopsRendered}
    </svg>
  )
}

export default observer(LollipopRendering)
