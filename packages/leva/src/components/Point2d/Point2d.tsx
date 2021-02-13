import React from 'react'
import { styled } from '../../styles'
import { Vector } from '../Vector'
import { InternalPoint2dSettings } from './point2d-plugin'
import { LevaInputProps, Point2d, Point2dObject } from '../../types'
import { Label, Row } from '../UI'
import { Joystick } from './Joystick'
import { useInputContext } from '../../context'

export type Point2dProps = LevaInputProps<Point2d, InternalPoint2dSettings, Point2dObject>

export const Container = styled('div', {
  display: 'grid',
  gridTemplateColumns: '$sizes$rowHeight repeat(2, 1fr)',
  columnGap: '$colGap',
})

export function Point2dComponent() {
  const { label, displayValue, onUpdate, settings } = useInputContext<Point2dProps>()
  return (
    <Row input>
      <Label>{label}</Label>
      <Container>
        <Joystick value={displayValue} settings={settings} onUpdate={onUpdate} />
        <Vector value={displayValue} settings={settings} onUpdate={onUpdate} />
      </Container>
    </Row>
  )
}
