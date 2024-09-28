import './App.css'

import { BrowserRouter, useRoutes } from 'react-router-dom'

import DesktopLanding from './DesktopLanding'
import MobileLanding from './MobileLanding'

import DesktopGraph from './DesktopGraph'
import MobileGraph from './MobileGraph'


import {
  useReducer,
} from 'react'

import {
  Context,
  initialState,
} from './store/Context'

import {
  reducer,
} from './store/reducer'

function RouteElementsDesktop() {
  const routeElements = useRoutes([
    { path: '/', element: <DesktopLanding /> },
    { path: '/graph', element: <DesktopGraph /> },
  ]);
  return routeElements
}

function RouteElementsMobile() {
  const routeElements = useRoutes([
    { path: '/', element: <MobileLanding /> },
    { path: '/graph', element: <MobileGraph /> },
  ]);
  return routeElements
}

function DesktopApp() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const value = {state, dispatch}
  
  return (
    <Context.Provider value={value}>
      <BrowserRouter>
        <RouteElementsDesktop />
      </BrowserRouter>
    </Context.Provider>
  )
}

function MobileApp() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const value = {state, dispatch}

  return (
    <Context.Provider value={value}>
      <BrowserRouter>
        <RouteElementsMobile />
      </BrowserRouter>
    </Context.Provider>
  )
}

function App() {
  function isDesktop() {
    return 850 < window.innerWidth
  }

  return (
    <>
    {
      isDesktop() ? <DesktopApp /> : <MobileApp />
    }
    </>
  )
}

export default App