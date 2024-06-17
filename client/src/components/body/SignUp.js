import { hashSync } from 'bcryptjs'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'

import axios from 'axios'
function SignUp() {

    let { register, handleSubmit, formState: { errors } } = useForm()
    let [err, setErr] = useState('')
    let navigate = useNavigate()

    async function onSignUpFormSubmit(userObj) {

        //make http post request
        let res = await axios.post('http://localhost:4000/user-api/user', userObj)
        if (res.data.message === "User created") {
            //navigate to login
            navigate('/signin')

        } else {
            setErr(res.data.message)
        }
    }

    console.log(err)

    return (
        <div>
            
            <div className='container'>
                <div className="row justify-content-center mt-5">
                    <div className="col-lg-4 col-md-6 col-sm-6">
                        <div className="card shadow text-center" style={{backgroundColor:'#A9A9A9'}}>
                            <h1 className="p-3">SignUp</h1>
                            {/* display user signup error message */}
                            {err.length !== 0 && <p className='text-danger fs-3'>{err}</p>}
                            <div className='card-body'>
                                <form action="" className="p-3" onSubmit={handleSubmit(onSignUpFormSubmit)}>
                                    {/* radio */}
                                    <div className='pb-2'>
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" {...register('userType')} type="radio" name="inlineRadioOptions" id="iauthor" value="author" />
                                            <label className="form-check-label" htmlFor="inlineRadio1">Author</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" {...register('userType')} type="radio" name="inlineRadioOptions" id="user" value="user" />
                                            <label className="form-check-label" htmlFor="inlineRadio2">User</label>
                                        </div>
                                    </div>
                                    {/* text-boxes */}
                                    <input type="text" {...register('username')} className="form-control mb-4" id='username' placeholder='Enter name' />
                                    <input type="password" {...register('password')} className="form-control mb-4" id='password' placeholder='create password' />
                                    <input type="email" {...register('email')} className="form-control mb-4" id='emal' placeholder='enter  emailId' />
                                    <button type="submit" className="btn btn-success">Register</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUp