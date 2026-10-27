import { useState } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import EnvironmentPicker from '@/themes/orange/components/EnvironmentPicker'

function Picker() {
  const [value, setValue] = useState('sunny')
  return (
    <>
      <EnvironmentPicker value={value} onChange={setValue} />
      <button type='button'>其他操作</button>
    </>
  )
}

test('the compact trigger opens four scene cards, selection closes and restores focus', () => {
  render(<Picker />)
  const trigger = screen.getByRole('button', { name: /切换小岛场景/ })
  expect(screen.queryByText('风轻轻，日子慢慢。')).not.toBeInTheDocument()
  fireEvent.click(trigger)
  expect(trigger).toHaveAttribute('aria-expanded', 'true')
  expect(screen.getByRole('radio', { name: '晴天小岛' })).toHaveFocus()
  fireEvent.click(screen.getByRole('radio', { name: '听雨小岛' }))
  expect(trigger).toHaveTextContent('听雨小岛')
  expect(trigger).toHaveFocus()
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(screen.queryByText('雨落窗外，屋里有光。')).not.toBeInTheDocument()
})

test('arrows preview weather in the open grid and Escape returns to the trigger', () => {
  render(<Picker />)
  const trigger = screen.getByRole('button', { name: /切换小岛场景/ })
  fireEvent.keyDown(trigger, { key: 'ArrowDown' })
  fireEvent.keyDown(screen.getByRole('radio', { name: '晴天小岛' }), {
    key: 'ArrowRight'
  })
  const rain = screen.getByRole('radio', { name: '听雨小岛' })
  expect(rain).toHaveFocus()
  expect(rain).toHaveAttribute('aria-checked', 'true')
  fireEvent.keyDown(rain, { key: 'ArrowDown' })
  const desert = screen.getByRole('radio', { name: '沙漠绿洲' })
  expect(desert).toHaveFocus()
  expect(desert).toHaveAttribute('aria-checked', 'true')
  expect(screen.getByRole('dialog')).toBeInTheDocument()
  fireEvent.keyDown(desert, { key: 'Escape' })
  expect(trigger).toHaveFocus()
  expect(trigger).toHaveAttribute('aria-expanded', 'false')
})

test('outside clicks and focus leaving dismiss the panel without changing the scene', () => {
  render(<Picker />)
  const trigger = screen.getByRole('button', { name: /切换小岛场景/ })
  fireEvent.click(trigger)
  fireEvent.pointerDown(screen.getByRole('button', { name: '其他操作' }))
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  fireEvent.click(trigger)
  fireEvent.blur(screen.getByRole('radio', { name: '晴天小岛' }), {
    relatedTarget: screen.getByRole('button', { name: '其他操作' })
  })
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(trigger).toHaveTextContent('晴天小岛')
})
