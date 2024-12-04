import {type Path} from '@sanity/types'

import {type BaseStructureToolPaneProps} from '../types'

/** @internal */
export type TimelineMode = 'since' | 'rev' | 'closed'

/** @internal */
export type DocumentPaneProviderProps = {
  children?: React.ReactNode
  onFocusPath?: (path: Path) => void
  /**
   * The perspective is normally determined by the router. The `perspectiveOverride` prop can be
   * used to explicitly set the perspective, overriding the perspective provided by the router.
   */
  perspectiveOverride?: string
} & BaseStructureToolPaneProps<'document'>
