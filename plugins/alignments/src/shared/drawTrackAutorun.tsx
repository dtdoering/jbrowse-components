import { getContainingView } from '@jbrowse/core/util'
import { LinearGenomeViewModel } from '@jbrowse/plugin-linear-genome-view'

// locals
import { createAutorun } from '../util'

type LGV = LinearGenomeViewModel

interface AnyDisplay {
  ref: HTMLCanvasElement | null
  loading: boolean
  height: number
  lastDrawnBpPerPx: number | undefined
  lastDrawnOffsetPx: number | undefined
  setLastDrawn: (offsetPx: number, bpPerPx: number) => void
  setError: (e: unknown) => void
}

export function drawTrackAutorun<T extends AnyDisplay>(
  self: T,
  cb: (
    self: T,
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
  ) => void,
) {
  function draw(view: LGV) {
    const canvas = self.ref
    if (!canvas) {
      return
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return
    }

    if (self.loading) {
      return
    }

    // ctx.clearRect(0, 0, canvas.width, self.height * 2)
    // ctx.resetTransform()
    // ctx.scale(2, 2)
    cb(self, ctx, canvas.width, self.height)
  }

  // first autorun instantly draws if bpPerPx changes
  createAutorun(self, async () => {
    const view = getContainingView(self) as LGV
    if (view.bpPerPx !== self.lastDrawnBpPerPx) {
      draw(view)
    }
  })

  // second autorun draws after delay 1000 e.g. if offsetPx changes
  createAutorun(
    self,
    async () => {
      const view = getContainingView(self) as LGV
      draw(view)
    },
    { delay: 500 },
  )
}
