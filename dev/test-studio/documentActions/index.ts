import {type DocumentActionsResolver} from 'sanity'

import {createCustomPublishAction} from './actions/createCustomPublishAction'
import {TestConfirmDialogAction} from './actions/TestConfirmDialogAction'
import {TestCustomComponentAction} from './actions/TestCustomComponentAction'
import {TestCustomRestoreAction} from './actions/TestCustomRestoreAction'
import {TestModalDialogAction} from './actions/TestModalDialogAction'
import {TestPopoverDialogAction} from './actions/TestPopoverDialogAction'

export const resolveDocumentActions: DocumentActionsResolver = (prev, {schemaType}) => {
  if (schemaType === 'documentActionsTest') {
    return [
      TestConfirmDialogAction,
      TestModalDialogAction,
      TestPopoverDialogAction,
      TestCustomComponentAction,
      ...prev,
    ].map((action) => {
      if (action.action === 'restore') {
        return TestCustomRestoreAction(action)
      }
      if (action.action === 'publish') {
        return createCustomPublishAction(action)
      }
      return action
    })
  }

  if (schemaType === 'removeRestoreActionTest') {
    return prev.filter(({action}) => action !== 'restore')
  }

  return [...prev]
}
