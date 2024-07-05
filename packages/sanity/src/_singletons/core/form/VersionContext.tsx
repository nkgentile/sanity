// eslint-disable-next-line no-warning-comments
/* TODO DO WE STILL NEED THIS AFTER THE STORES ARE SET UP? */

// eslint-disable-next-line import/consistent-type-specifier-style
import {createContext, type ReactElement} from 'react'

import {useBundlesStore} from '../../../core/store/bundles'
import type {BundleDocument} from '../../../core/store/bundles/types'
import {LATEST} from '../../../core/versions/util/const'
import {useRouter} from '../../../router'

export interface VersionContextValue {
  currentVersion: Partial<BundleDocument>
  isDraft: boolean
  setCurrentVersion: (bundle: Partial<BundleDocument>) => void
}

export const VersionContext = createContext<VersionContextValue>({
  currentVersion: LATEST,
  isDraft: true,
  // eslint-disable-next-line no-empty-function
  setCurrentVersion: () => {},
})

interface VersionProviderProps {
  children: ReactElement
}

export function VersionProvider({children}: VersionProviderProps): JSX.Element {
  const router = useRouter()
  const {data: bundles} = useBundlesStore()

  const setCurrentVersion = (version: Partial<BundleDocument>) => {
    const {name} = version
    if (name === 'drafts') {
      router.navigateStickyParam('perspective', '')
    } else {
      router.navigateStickyParam('perspective', `bundle.${name}`)
    }
  }
  const selectedVersion =
    router.stickyParams?.perspective && bundles
      ? bundles.find((bundle) => {
          return (
            `bundle.${bundle.name}`.toLocaleLowerCase() ===
            router.stickyParams.perspective?.toLocaleLowerCase()
          )
        })
      : LATEST

  const currentVersion = selectedVersion || LATEST

  const isDraft = currentVersion.name === 'drafts'

  const contextValue: VersionContextValue = {
    isDraft,
    setCurrentVersion,
    currentVersion,
  }

  return <VersionContext.Provider value={contextValue}>{children}</VersionContext.Provider>
}