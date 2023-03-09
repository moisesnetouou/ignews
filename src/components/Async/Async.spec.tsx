import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import { Async } from '.'

describe('Async tests', () => {
  it('it renders correctly', async () => {
    render(<Async />)

    expect(screen.getByText('Hello World')).toBeInTheDocument()
    expect(
      await screen.findByText('Button', {}, { timeout: 20000 }),
    ).toBeInTheDocument()
  })

  it('it renders correctly - waitFor', async () => {
    render(<Async />)

    expect(screen.getByText('Hello World')).toBeInTheDocument()

    await waitFor(
      () => {
        return expect(screen.getByText('Button')).toBeInTheDocument()
      },
      {
        timeout: 2000,
      },
    )
  })

  it('it renders correctly - waitForElementToBeRemoved', async () => {
    render(<Async />)

    expect(screen.getByText('Hello World')).toBeInTheDocument()

    await waitForElementToBeRemoved(screen.queryByText('Button Invisible'), {
      timeout: 20000,
    })
  })
})
