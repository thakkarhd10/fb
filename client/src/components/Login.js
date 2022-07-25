import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { getAppBaseUrl, setAuthToken } from '../utils'

const BASE_URL = getAppBaseUrl()

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loader, setLoader] = useState(false)
    const navigate = useNavigate()

    const onLogin = async (e) => {
        e.preventDefault()
        const emailAddress = email.trim().toLowerCase()
        const emailRegex = RegExp(
            /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        )
        if (emailAddress === '') {
            return alert('Please enter email address')
        }
        if (!emailRegex.test(emailAddress)) {
            return alert('Please enter invalid email address')
        }
        if (password.trim() === '') {
            return alert('Please enter password')
        }

        const url = BASE_URL + '/api/login-or-register'
        const data = {
            email: emailAddress,
            password
        }
        try {
            setLoader(true)
            const res = await axios.post(url, data)
            const token = res.data.data._id || null
            if (token !== null) {
                localStorage.setItem('token', res.data.data._id)
                localStorage.setItem('email', emailAddress)
                setAuthToken(token)
                navigate('/')
            }
            setLoader(false)
        } catch (err) {
            setLoader(false)
            const errorMessage = err.response.data.message || 'something went wrong'
            alert(errorMessage)
        }
    }

    return (
        <div className='row' style={{ justifyContent: 'center', height: '100vh' }}>
            <div className='col-md-4 col-12'>
                <form onSubmit={onLogin}>
                    <div className="mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label" >Email address</label>
                        <input
                            type="email"
                            className="form-control"
                            id="exampleInputEmail1"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loader}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                        <input
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            className="form-control"
                            id="exampleInputPassword1"
                            disabled={loader}
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loader}
                    >
                        Login Or Register
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login