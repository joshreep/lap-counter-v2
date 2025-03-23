import { FC, PropsWithChildren } from 'react'

import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

const AppLayout: FC<PropsWithChildren> = ({ children }) => children

export default AppLayout
