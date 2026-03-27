import { FC, HTMLAttributes, Ref, SelectHTMLAttributes } from 'react'
import classNames from 'classnames'

interface SelectGroupProps extends SelectHTMLAttributes<HTMLSelectElement> {
  id: string
  label: string
  options: { label: string; value: string }[]
  ref?: Ref<HTMLSelectElement>
  selectClassName?: HTMLAttributes<HTMLSelectElement>['className']
  'data-testid'?: string
}

const SelectGroup: FC<SelectGroupProps> = ({ label, options, ref, selectClassName, ...props }) => {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={props.id}
        className={classNames('p-0  ml-1.5', { 'text-disabled-text': props.disabled })}
      >
        {label}
      </label>
      <select
        {...props}
        className={classNames('w-full p-4 border-solid bg-input-bg rounded-md', selectClassName)}
        ref={ref}
      >
        <option value="" disabled>
          Select {label}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default SelectGroup
