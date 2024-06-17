import React from 'react'
import {Outlet} from 'react-router-dom'
import Footer from './footer/Footer'
import NavBar from './NavBar/NavBar'
function RootLayout() {
  return (
    <div className='bg-secondary'>
        <NavBar/>
        <div style={{minHeight:'85vh'}}>
            <Outlet/>
        </div>
        <Footer/>
    </div>
  )
}

export default RootLayout