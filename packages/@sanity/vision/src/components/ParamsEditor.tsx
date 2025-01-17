import {debounce} from 'lodash'
import {type ClipboardEvent, useCallback, useEffect, useMemo, useState} from 'react'
import {type TFunction, useTranslation} from 'sanity'

import {VisionCodeMirror} from '../codemirror/VisionCodeMirror'
import {visionLocaleNamespace} from '../i18n'
import {tryParseParams} from '../util/tryParseParams'

const defaultValue = `{\n  \n}`

export interface ParamsEditorChangeEvent {
  parsed: Record<string, unknown>
  raw: string
  valid: boolean
  error: string | undefined
}

export interface ParamsEditorProps {
  value: string
  onChange: (changeEvt: ParamsEditorChangeEvent) => void
  onPasteCapture: (event: ClipboardEvent<HTMLDivElement>) => void
}

export interface ParamsEditorChange {
  valid: boolean
}

export function ParamsEditor(props: ParamsEditorProps) {
  const {onChange, onPasteCapture} = props
  const {t} = useTranslation(visionLocaleNamespace)
  const {raw: value, error, parsed, valid} = eventFromValue(props.value, t)
  const [isValid, setValid] = useState(valid)
  const [init, setInit] = useState(false)

  // Emit onChange on very first render
  useEffect(() => {
    if (!init) {
      onChange({parsed, raw: value, valid: isValid, error})
      setInit(true)
    }
  }, [error, init, isValid, onChange, parsed, value])

  const handleChangeRaw = useCallback(
    (newValue: string) => {
      const event = eventFromValue(newValue, t)
      setValid(event.valid)
      onChange(event)
    },
    [onChange, t],
  )

  const handleChange = useMemo(() => debounce(handleChangeRaw, 333), [handleChangeRaw])
  return (
    <VisionCodeMirror
      value={props.value || defaultValue}
      onChange={handleChange}
      onPasteCapture={onPasteCapture}
    />
  )
}

function eventFromValue(
  value: string,
  t: TFunction<typeof visionLocaleNamespace, undefined>,
): ParamsEditorChangeEvent {
  const parsedParams = tryParseParams(value, t)
  const params = parsedParams instanceof Error ? {} : parsedParams
  const validationError = parsedParams instanceof Error ? parsedParams.message : undefined
  const isValid = !validationError

  return {
    parsed: params,
    raw: value,
    valid: isValid,
    error: validationError,
  }
}
