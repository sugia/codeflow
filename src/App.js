import './App.css'

import { BrowserRouter, useRoutes } from 'react-router-dom'

import DesktopLanding from './DesktopLanding'
import MobileLanding from './MobileLanding'

import DesktopGraph from './DesktopGraph'
import MobileGraph from './MobileGraph'


import {
  useReducer,
  useEffect,
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

  return (
    <BrowserRouter>
      <RouteElementsDesktop />
    </BrowserRouter>
  )
}

function MobileApp() {


  return (
    <BrowserRouter>
      <RouteElementsMobile />
    </BrowserRouter>
  )
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const value = { state, dispatch }

  function isDesktop() {
    return 850 < window.innerWidth
  }


  const getEndorsementList = () => {

    const jsonData = {}
    fetch('https://api.jomimi.com/get_endorsement_list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonData),
    })
      .then(res => res.json())
      .then(data => {
        //console.log(data)
        if (data.status.toString()[0] === '2') {
          dispatch({
            value: {
              'endorsementList': data.value,
            }
          })

          //console.log(data)
        } else {
          console.log(data)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  useEffect(() => {
    getEndorsementList()
  }, [])


  return (
    <Context.Provider value={value}>
      {
        isDesktop() ? <DesktopApp /> : <MobileApp />
      }
    </Context.Provider>
  )
}

export default App