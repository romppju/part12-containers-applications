/* eslint-disable testing-library/no-debugging-utils */
import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Todo from './Todo'

describe('Todo component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetModules()
  })

  test('renders content', () => {
    const todo = {
      text: 'Test todo',
      done: false,
    }

    const mockDelete = jest.fn()
    const mockComplete = jest.fn()

    render(
      <Todo
        todo={todo}
        onClickComplete={mockComplete}
        onClickDelete={mockDelete}
      />
    )

    const element = screen.getByText('Test todo')
    screen.debug(element)
    expect(element).toBeDefined()
  })

  test('Done button works', () => {
    const todo = {
      text: 'Test todo',
      done: false,
    }

    const mockDelete = jest.fn()
    const mockComplete = jest.fn()

    render(
      <Todo
        todo={todo}
        onClickComplete={mockComplete}
        onClickDelete={mockDelete}
      />
    )

    userEvent.click(screen.getByText('Set as done'))
    expect(mockComplete).toHaveBeenCalledTimes(1)
  })
})
