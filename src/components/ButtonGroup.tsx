import { BaseHTMLAttributes, FC, PropsWithChildren } from 'react'
import classNames from 'classnames'

const ButtonGroup: FC<PropsWithChildren<BaseHTMLAttributes<HTMLDivElement>>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={classNames('flex justify-between gap-5', className)} {...props}>
      {children}
    </div>
  )
}

export default ButtonGroup
