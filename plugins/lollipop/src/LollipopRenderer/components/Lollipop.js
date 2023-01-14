import { readConfObject } from '@jbrowse/core/configuration'
import { contrastingTextColor } from '@jbrowse/core/util/color'
import { observer } from 'mobx-react'

function ScoreText({
  feature,
  config,
  layoutRecord: {
    y,
    data: { anchorX, radiusPx, score },
  },
}) {
  const innerColor = readConfObject(config, 'innerColor', { feature })

  const scoreString = String(score)
  const fontWidth = (radiusPx * 2) / scoreString.length
  const fontHeight = fontWidth * 1.1
  if (fontHeight < 12) {
    return null
  }
  return (
    <text
      style={{ fontSize: fontHeight, fill: contrastingTextColor(innerColor) }}
      x={anchorX}
      y={y + radiusPx - fontHeight / 2.4}
      textAnchor="middle"
      dominantBaseline="hanging"
    >
      {scoreString}
    </text>
  )
}

function Lollipop(props) {
  const onFeatureMouseDown = event => {
    const { onFeatureMouseDown: handler, feature } = props
    if (!handler) {
      return undefined
    }
    return handler(event, feature.id())
  }

  const onFeatureMouseEnter = event => {
    const { onFeatureMouseEnter: handler, feature } = props
    if (!handler) {
      return undefined
    }
    return handler(event, feature.id())
  }

  const onFeatureMouseOut = event => {
    const { onFeatureMouseOut: handler, feature } = props
    if (!handler) {
      return undefined
    }
    return handler(event, feature.id())
  }

  const onFeatureMouseOver = event => {
    const { onFeatureMouseOver: handler, feature } = props
    if (!handler) {
      return undefined
    }
    return handler(event, feature.id())
  }

  const onFeatureMouseUp = event => {
    const { onFeatureMouseUp: handler, feature } = props
    if (!handler) {
      return undefined
    }
    return handler(event, feature.id())
  }

  const onFeatureMouseLeave = event => {
    const { onFeatureMouseLeave: handler, feature } = props
    if (!handler) {
      return undefined
    }
    return handler(event, feature.id())
  }

  const onFeatureMouseMove = event => {
    const { onFeatureMouseMove: handler, feature } = props
    if (!handler) {
      return undefined
    }
    return handler(event, feature.id())
  }

  const onFeatureClick = event => {
    const { onFeatureClick: handler, feature } = props
    if (!handler) {
      return undefined
    }
    event.stopPropagation()
    return handler(event, feature.id())
  }

  const {
    feature,
    config,
    layoutRecord: {
      anchorLocation,
      y,
      data: { radiusPx, score },
    },
    selectedFeatureId,
  } = props

  const styleOuter = {
    fill: readConfObject(config, 'strokeColor', { feature }),
  }
  if (String(selectedFeatureId) === String(feature.id())) {
    styleOuter.fill = 'red'
  }

  const styleInner = {
    fill: readConfObject(config, 'innerColor', { feature }),
  }

  const strokeWidth = readConfObject(config, 'strokeWidth', { feature })

  return (
    <g data-testid={feature.id()}>
      <title>{readConfObject(config, 'caption', { feature })}</title>
      <circle
        cx={anchorLocation}
        cy={y + radiusPx}
        r={radiusPx}
        style={styleOuter}
        onMouseDown={onFeatureMouseDown}
        onMouseEnter={onFeatureMouseEnter}
        onMouseOut={onFeatureMouseOut}
        onMouseOver={onFeatureMouseOver}
        onMouseUp={onFeatureMouseUp}
        onMouseLeave={onFeatureMouseLeave}
        onMouseMove={onFeatureMouseMove}
        onClick={onFeatureClick}
        onFocus={onFeatureMouseOver}
        onBlur={onFeatureMouseOut}
      />
      {radiusPx - strokeWidth <= 2 ? null : (
        <circle
          cx={anchorLocation}
          cy={y + radiusPx}
          r={radiusPx - strokeWidth}
          style={styleInner}
          onMouseDown={onFeatureMouseDown}
          onMouseEnter={onFeatureMouseEnter}
          onMouseOut={onFeatureMouseOut}
          onMouseOver={onFeatureMouseOver}
          onMouseUp={onFeatureMouseUp}
          onMouseLeave={onFeatureMouseLeave}
          onMouseMove={onFeatureMouseMove}
          onClick={onFeatureClick}
          onFocus={onFeatureMouseOver}
          onBlur={onFeatureMouseOut}
        />
      )}
      <ScoreText {...props} score={score} />
    </g>
  )
}

export default observer(Lollipop)
