import { styled } from '../../styles'

export const SelectContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '> svg': {
    pointerEvents: 'none',
    position: 'absolute',
    right: '$md',
  },
})

export const StyledSelect = styled('select', {
  width: '100%',
  $reset: '',
  height: '$rowHeight',
  backgroundColor: '$elevation3',
  color: '$highlight3',
  borderStyle: 'none',
  borderRadius: '$sm',
  padding: '0 $sm',
  cursor: 'pointer',
  $hover: '',
  $focus: '',
})
