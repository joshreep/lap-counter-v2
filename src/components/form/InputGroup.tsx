import { FC, InputHTMLAttributes, Ref } from 'react'
import classNames from 'classnames'

interface InputGroupProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  ref?: Ref<HTMLInputElement>
  'data-testid'?: string
}

const InputGroup: FC<InputGroupProps> = ({ disabled, label, ref, ...props }) => {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={props.id}
        className={classNames('p-0  ml-1.5', { 'text-disabled-text': disabled })}
      >
        {label}
      </label>
      {disabled ? (
        <div className="w-full p-4 rounded-sm bg-disabled-bg">
          <p className="text-disabled-text" data-testid={props['data-testid']}>
            {props.value}
          </p>
        </div>
      ) : (
        <input className={'w-full p-4 border-solid bg-input-bg rounded-md'} {...props} ref={ref} />
      )}
    </div>
  )
}

export default InputGroup
