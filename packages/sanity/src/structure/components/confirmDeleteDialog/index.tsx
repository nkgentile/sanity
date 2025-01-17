import {Box, Text} from '@sanity/ui'
import {type ComponentProps, useCallback, useId, useState} from 'react'
import {useTranslation} from 'sanity'

import {Dialog, ErrorBoundary} from '../../../ui-components'
import {structureLocaleNamespace} from '../../i18n'
import {ConfirmDeleteDialog, type ConfirmDeleteDialogProps} from './ConfirmDeleteDialog'

export type {ConfirmDeleteDialogProps}

type ArgType<T> = T extends (arg: infer U) => unknown ? U : never
type ErrorInfo = ArgType<ComponentProps<typeof ErrorBoundary>['onCatch']>

/** @internal */
function ConfirmDeleteDialogContainer(props: ConfirmDeleteDialogProps) {
  const {t} = useTranslation(structureLocaleNamespace)
  const id = useId()
  const [error, setError] = useState<ErrorInfo | null>(null)
  const handleRetry = useCallback(() => setError(null), [])

  return error ? (
    <Dialog
      id={`dialog-error-${id}`}
      data-testid="confirm-delete-error-dialog"
      header={t('confirm-delete-dialog.error.title.text')}
      footer={{
        confirmButton: {
          text: t('confirm-delete-dialog.error.retry-button.text'),
          onClick: handleRetry,
          tone: 'default',
        },
      }}
      onClose={props.onCancel}
    >
      <Box padding={4}>
        <Text size={1}>{t('confirm-delete-dialog.error.message.text')}</Text>
      </Box>
    </Dialog>
  ) : (
    <ErrorBoundary onCatch={setError}>
      <ConfirmDeleteDialog {...props} />
    </ErrorBoundary>
  )
}

export {ConfirmDeleteDialogContainer as ConfirmDeleteDialog}
