import {isPlainObject, toPath} from 'lodash'

export function normalizeUserSearchConfigs(configs) {
  if (!Array.isArray(configs)) {
    throw new Error(
      'The search config of a document type must be an array of search config objects'
    )
  }
  return configs.map((conf) => {
    if (conf === 'defaults') {
      return conf
    }
    if (!isPlainObject(conf)) {
      throw new Error('Search config must be an object of {path: string, weight: number}')
    }
    return {
      weight: 'weight' in conf ? conf.weight : 1,
      path: toPath(conf.path).map(stringsToNumbers),
      mapWith: typeof conf.mapWith === 'string' ? conf.mapWith : undefined,
      userProvided: true,
    }
  })
}

export function stringsToNumbers(pathSegment: string | number): string | number {
  const pathAsNumber = Number(pathSegment)
  if (!Number.isNaN(pathAsNumber)) {
    return pathAsNumber
  }
  return pathSegment
}
