import React from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector,useDispatch } from 'react-redux'
import { resetState } from '../../redux/slices/userAuthorSlice'

function NavBar() {
    let {loginUserStatus,errorOccurred,errMsg,currentUser}=useSelector(state=>state.userAuthorLoginReducer)

    let dispatch=useDispatch()
    function signOut(){
        //remove token from local storage
        localStorage.removeItem('token')
        dispatch(resetState())
    }

    return (
        <div>
            <ul className="nav justify-content-end bg-dark p-3">
                {loginUserStatus === false ?
                    (<>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="">Home</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/signup">SignUp</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/signin">SignIn</NavLink>
                        </li></>) : (
                            <>
                            <li className="">
                            <p className='fs-3 text-primary'>Welcome {currentUser.username}</p>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/signin" onClick={signOut}>SignOut</NavLink>
                        </li></>)}

            </ul>
        </div>
    )
}

export default NavBar