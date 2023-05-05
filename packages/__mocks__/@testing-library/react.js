import { createTheme, ThemeProvider } from '@mui/material/styles'

const react = jest.requireActual('@testing-library/react')
const render = args => {
  return react.render(
    <ThemeProvider theme={createTheme()}>{args}</ThemeProvider>,
  )
}

module.exports = { ...react, render }
