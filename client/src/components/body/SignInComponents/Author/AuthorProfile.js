import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import Nav2 from '../Nav2'
import NavBar from '../../../NavBar/NavBar'

function AuthorProfile() {
    return (
        <div>
            
            <Nav2 />
            
            <Outlet />
        </div>
    )
}

export default AuthorProfile