import { ButtonHTMLAttributes, FC } from 'react'
import classNames from 'classnames'

type ButtonStyle = 'primary' | 'secondary' | 'error' | 'tint'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  buttonStyle: ButtonStyle
}

const Button: FC<ButtonProps> = ({ className, buttonStyle: style = 'primary', ...props }) => {
  return (
    <button
      className={classNames(
        `py-3 px-5 rounded-lg border-none bg-${style} text-white active:bg-blend-darken`,
        className,
      )}
      {...props}
    />
  )
}

export default Button
