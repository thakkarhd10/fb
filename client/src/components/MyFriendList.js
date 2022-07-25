import React, { useState, useEffect } from 'react'
import axios from 'axios'

import { getAppBaseUrl } from '../utils'

const BASE_URL = getAppBaseUrl()

function MyFriendList() {

    const [users, setUsers] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        getMyFriendList()
    }, [])

    const getMyFriendList = async () => {
        const userId = localStorage.token
        const data = {
            userId
        }
        const url = BASE_URL + '/api/get-friend-list'
        try {
            setIsLoading(true)
            const res = await axios.post(url, data)
            setUsers(res.data.data)
            setIsLoading(false)
        } catch (err) {
            setIsLoading(false)
            const errorMessage = err.response.data.message || 'something went wrong'
            alert(errorMessage)
        }
    }

    return <div className='container'>
        <div className='row text-center'>
            {isLoading ?
                <label className='mt-3'>Loading</label>
                :
                <div className='mt-3'>
                    {users.length > 0 ? users.map((user) => {
                        return <div className='col-12 mb-2' key={user._id}>
                            <label>{user.email}</label>
                        </div>
                    })
                        :
                        <div>No friend found.</div>
                    }
                </div>
            }
        </div>
    </div>
}

export default MyFriendList