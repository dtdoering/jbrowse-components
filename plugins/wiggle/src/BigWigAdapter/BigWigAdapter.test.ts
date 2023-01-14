import { toArray } from 'rxjs/operators'
import { firstValueFrom } from 'rxjs'
import BigWigAdapter from './BigWigAdapter'
import configSchema from './configSchema'

let adapter: BigWigAdapter
beforeEach(() => {
  adapter = new BigWigAdapter(
    configSchema.create({
      bigWigLocation: {
        localPath: require.resolve('./test_data/volvox.bw'),
        locationType: 'LocalPathLocation',
      },
    }),
  )
})
test('test basic aspects of getfeat', async () => {
  const feat = adapter.getFeatures({
    refName: 'ctgA',
    start: 0,
    end: 20000,
    assemblyName: 'volvox',
  })
  expect(await adapter.refIdToName(0)).toBe('ctgA')
  expect(await adapter.refIdToName(1)).toBe(undefined)
  expect(await adapter.hasDataForRefName('ctgA')).toBe(true)
  expect(await adapter.hasDataForRefName('ctgB')).toBe(false)

  const featArr = await firstValueFrom(feat.pipe(toArray()))
  expect(featArr.map(f => f.toJSON()).slice(1000, 1010)).toMatchSnapshot()
})

test('adapter can fetch stats from volvox.bw', async () => {
  expect(await adapter.getGlobalStats()).toMatchSnapshot()
})

test('get region stats', async () => {
  expect(
    await adapter.getRegionStats({
      refName: 'ctgA',
      start: 10000,
      end: 40000,
      assemblyName: 'volvox',
    }),
  ).toMatchSnapshot()
})

test('get local stats', async () => {
  expect(
    await adapter.getMultiRegionStats([
      {
        refName: 'ctgA',
        start: 10000,
        end: 39999,
        assemblyName: 'volvox',
      },
      {
        refName: 'ctgB',
        start: 0,
        end: 99,
        assemblyName: 'volvox',
      },
    ]),
  ).toMatchSnapshot()
})
