import React, { useMemo, useState } from 'react'
import { buildTree } from './tree'
import { TreeWrapper } from '../Folder'

import { useDeepMemo, useTransform, useVisiblePaths } from '../../hooks'

import { StyledRoot } from './StyledRoot'
import { mergeTheme, LevaCustomTheme } from '../../styles'
import { ThemeContext, StoreContext, PanelSettingsContext } from '../../context'
import { TitleWithFilter } from './Filter'
import { StoreType } from '../../types'

export type LevaRootProps = {
  /**
   * Theme with Stitches tokens
   */
  theme?: LevaCustomTheme
  /**
   * The store to be used by the panel
   */
  store?: StoreType | null
  /**
   * If true, won't display the panel
   */
  hidden?: boolean
  /**
   * If true, the panel will fill its parent
   */
  fill?: boolean
  /**
   * If true, the panel will have no border radius nor shadow
   */
  flat?: boolean
  /**
   * If true, the panel will start collapsed
   */
  collapsed?: boolean
  /**
   * If true, input labels will stand above the controls
   */
  oneLineLabels?: boolean
  /**
   * If true, the title bar including filters and drag zone will be shown. If set to false, the title bar including filters will be hidden.
   * In case it is set to an object the title bar will be shown and the additional sub-options might be applied.
   */
  titleBar?:
    | boolean
    | {
        /**
         * Overwrites the default title content (6 dots if drag is enabled) if set to a non undefined value.
         */
        title?: React.ReactNode
        /**
         * Toggle whether the leva panel can be dragged around via the title bar.
         */
        drag?: boolean
        /**
         * Toggle whether filtering should be enabled or disabled.
         */
        filter?: boolean
      }
  /**
   * If true, the copy button will be hidden
   */
  hideCopyButton?: boolean
  /**
   * Change what will be copied when clicking the global copy button
   */
  copy?: (values: unknown) => string
}

export function LevaRoot({ store, hidden = false, theme, collapsed = false, ...props }: LevaRootProps) {
  const themeContext = useDeepMemo(() => mergeTheme(theme), [theme])
  // collapsible
  const [toggled, setToggle] = useState(!collapsed)
  if (!store || hidden) return null

  return (
    <ThemeContext.Provider value={themeContext}>
      <LevaCore store={store} {...props} toggled={toggled} setToggle={setToggle} rootClass={themeContext.className} />
    </ThemeContext.Provider>
  )
}

type LevaCoreProps = Omit<LevaRootProps, 'theme' | 'hidden' | 'collapsed'> & {
  store: StoreType
  rootClass: string
  toggled: boolean
  setToggle: React.Dispatch<React.SetStateAction<boolean>>
}

const LevaCore = React.memo(
  ({
    store,
    rootClass,
    fill = false,
    flat = false,
    oneLineLabels = false,
    titleBar = {
      title: undefined,
      drag: true,
      filter: true,
    },
    hideCopyButton = false,
    copy,
    toggled,
    setToggle,
  }: LevaCoreProps) => {
    const paths = useVisiblePaths(store)
    const [filter, setFilter] = useState('')
    const tree = useMemo(() => buildTree(paths, filter), [paths, filter])

    // drag
    const [rootRef, set] = useTransform<HTMLDivElement>()

    // this generally happens on first render because the store is initialized in useEffect.
    const shouldShow = paths.length > 0
    const title = typeof titleBar === 'object' ? titleBar.title : undefined
    const drag = typeof titleBar === 'object' ? titleBar.drag ?? true : true
    const filterEnabled = typeof titleBar === 'object' ? titleBar.filter ?? true : true

    return (
      <PanelSettingsContext.Provider value={{ hideCopyButton }}>
        <StoreContext.Provider value={store}>
          <StyledRoot
            ref={rootRef}
            className={rootClass}
            fill={fill}
            flat={flat}
            oneLineLabels={oneLineLabels}
            hideTitleBar={!titleBar}
            style={{ display: shouldShow ? 'block' : 'none' }}>
            {titleBar && (
              <TitleWithFilter
                onDrag={set}
                setFilter={setFilter}
                toggle={(flag?: boolean) => setToggle((t) => flag ?? !t)}
                toggled={toggled}
                title={title}
                drag={drag}
                filterEnabled={filterEnabled}
                hideCopyButton={hideCopyButton}
                copy={copy}
              />
            )}
            {shouldShow && <TreeWrapper isRoot fill={fill} flat={flat} tree={tree} toggled={toggled} />}
          </StyledRoot>
        </StoreContext.Provider>
      </PanelSettingsContext.Provider>
    )
  }
)
