import {useEffect, useState} from 'react'

import {useProjectStore} from '../datastores'
import {type ProjectDatasetData} from './types'

/** @internal */
export function useProjectDatasets(): {value: ProjectDatasetData[] | null} {
  const projectStore = useProjectStore()
  const [value, setValue] = useState<ProjectDatasetData[] | null>(null)

  useEffect(() => {
    const project$ = projectStore.getDatasets()
    const sub = project$.subscribe(setValue)

    // @TODO see if it's better to useObservable here
    return () => sub.unsubscribe()
  }, [projectStore])

  return {value}
}
