import {useCallback, useState} from 'react'

import {ReleaseInputsForm} from '../../components/dialog/ReleaseInputsForm'
import {type EditableReleaseDocument, type ReleaseDocument, useReleaseOperations} from '../../index'

export function ReleaseDetailsEditor({release}: {release: ReleaseDocument}): JSX.Element {
  const {updateRelease} = useReleaseOperations()
  const [timer, setTimer] = useState<NodeJS.Timeout | undefined>(undefined)

  const handleOnChange = useCallback(
    (changedValue: EditableReleaseDocument) => {
      clearTimeout(timer)

      /** @todo I wasn't able to get this working with the debouncer that we use in other parts */
      const newTimer = setTimeout(() => {
        updateRelease(changedValue)
      }, 200)

      setTimer(newTimer)
    },
    [timer, updateRelease],
  )

  return <ReleaseInputsForm release={release} onChange={handleOnChange} />
}
