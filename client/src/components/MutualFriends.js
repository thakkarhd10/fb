import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

import { getAppBaseUrl } from '../utils'

const BASE_URL = getAppBaseUrl()

function MutualFriends(props) {

    const [users, setUsers] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const getMutualFriendList = useCallback(async () => {
        const userId = localStorage.token
        const data = {
            userId,
            mutualFriendId: props.mutualFriendId
        }
        const url = BASE_URL + '/api/get-mutual-friend-list'
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
    }, [props.mutualFriendId])

    useEffect(() => {
        getMutualFriendList()
    }, [getMutualFriendList])


    return <div className='container'>
        <div className='row text-center'>
            {isLoading ?
                <label className='mt-3'>Loading</label>
                :
                <div className=''>
                    <button className='btn btn-primary mb-3' onClick={() => props.close()}>Back</button>
                    {users.length > 0 ? users.map((user) => {
                        return <div className='col-12 mb-2' key={user._id}>
                            <label>{user.email}</label>
                        </div>
                    })
                        :
                        <div>No mutual friend found.</div>
                    }
                </div>
            }
        </div>
    </div>
}

export default MutualFriends