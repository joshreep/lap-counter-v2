import { FC, InputHTMLAttributes, Ref } from 'react'
import { DisabledInput, DisabledInputText, Group, Input, Label } from './InputGroup.style'

interface InputGroupProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  ref?: Ref<HTMLInputElement>
  'data-testid'?: string
}

const InputGroup: FC<InputGroupProps> = ({ disabled, label, ref, ...props }) => {
  return (
    <Group>
      <Label htmlFor={props.id} disabled={disabled}>
        {label}
      </Label>
      {disabled ? (
        <DisabledInput>
          <DisabledInputText data-testid={props['data-testid']}>{props.value}</DisabledInputText>
        </DisabledInput>
      ) : (
        <Input {...props} ref={ref} />
      )}
    </Group>
  )
}

export default InputGroup
