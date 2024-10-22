import {useRouter} from 'sanity/router'

import {useReleases} from '../../store/release'
import {type ReleaseDocument} from '../../store/release/types'
import {LATEST} from '../util/const'

/**
 * @internal
 */
export interface PerspectiveValue {
  /* Return the current global release */
  currentGlobalBundle: Partial<ReleaseDocument>
  /* Change the perspective in the studio based on the perspective name */
  setPerspective: (bundleId: string) => void
}

/**
 * TODO: Improve distinction between global and pane perspectives.
 *
 * @internal
 */
export function usePerspective(selectedPerspective?: string): PerspectiveValue {
  const router = useRouter()
  const {data: bundles} = useReleases()
  const perspective = selectedPerspective ?? router.stickyParams.perspective

  // TODO: Should it be possible to set the perspective within a pane, rather than globally?
  const setPerspective = (bundleId: string | undefined) => {
    if (bundleId === 'drafts') {
      router.navigateStickyParam('perspective', '')
    } else if (bundleId === 'published') {
      router.navigateStickyParam('perspective', 'published')
    } else {
      router.navigateStickyParam('perspective', `bundle.${bundleId}`)
    }
  }

  const selectedBundle =
    perspective && bundles
      ? bundles.find((bundle: ReleaseDocument) => `bundle.${bundle._id}` === perspective)
      : LATEST

  // TODO: Improve naming; this may not be global.
  const currentGlobalBundle =
    perspective === 'published'
      ? {
          _id: 'published',
          title: 'Published',
        }
      : selectedBundle || LATEST

  return {
    setPerspective,
    currentGlobalBundle,
  }
}
