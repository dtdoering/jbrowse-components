import { toArray } from 'rxjs/operators'
import path from 'path'
import { LocalFile, GenericFilehandle } from 'generic-filehandle'
import { firstValueFrom } from 'rxjs'
// locals
import Adapter from './NCListAdapter'
import configSchema from './configSchema'

export function generateReadBuffer(
  getFileFunction: (str: string) => GenericFilehandle,
) {
  return async (request: RequestInfo | URL) => {
    const filehandle = getFileFunction(`${request}`)
    const str = await filehandle.readFile('utf8')
    return new Response(str)
  }
}

jest
  .spyOn(global, 'fetch')
  .mockImplementation(
    generateReadBuffer(
      url => new LocalFile(path.join(__dirname, `../../test_data/${url}`)),
    ),
  )

test('adapter can fetch features from ensembl_genes test set', async () => {
  const args = {
    refNames: [],
    rootUrlTemplate: {
      uri: 'ensembl_genes/{refseq}/trackData.json',
      locationType: 'UriLocation',
    },
  }
  const adapter = new Adapter(configSchema.create(args))

  const features = adapter.getFeatures({
    assemblyName: 'volvox',
    refName: '21',
    start: 34960388,
    end: 35960388,
  })

  const featArr = await firstValueFrom(features.pipe(toArray()))
  expect(featArr[0].get('refName')).toBe('21')
  expect(featArr[0].id()).toBe(`test-21,0,0,19,22,0`)
  const featJson = featArr.map(f => f.toJSON())
  expect(featJson.length).toEqual(94)
  for (const feature of featJson) {
    expect(feature).toMatchSnapshot({ uniqueId: expect.any(String) })
  }

  expect(await adapter.hasDataForRefName('ctgA')).toBe(false)
  expect(await adapter.hasDataForRefName('21')).toBe(true)
  expect(await adapter.hasDataForRefName('20')).toBe(false)
}, 10000)
