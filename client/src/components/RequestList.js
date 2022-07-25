import React, { useState, useEffect } from 'react'
import axios from 'axios'

import { getAppBaseUrl } from '../utils'
import MutualFriends from './MutualFriends'

const BASE_URL = getAppBaseUrl()

function RequestList() {

    const [users, setUsers] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [mutualFriendId, setMutualFriendId] = useState(false)

    useEffect(() => {
        getMyFriendList()
    }, [])

    const getMyFriendList = async () => {
        const userId = localStorage.token
        const data = {
            userId
        }
        const url = BASE_URL + '/api/get-request-list'
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

    const onResponse = async (user, isAccepted, index) => {
        const userId = localStorage.token

        const data = {
            userId,
            sender_id: user._id,
            is_accepted: isAccepted
        }

        const url = BASE_URL + '/api/respond-friend-request'
        try {
            const res = await axios.post(url, data)
            if (res.data.is_success) {
                const copyList = [...users]
                copyList[index].isAccepted = isAccepted
                setUsers(copyList)
            }
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
                <>
                    {mutualFriendId === false ?
                        <div className='mt-3'>
                            {users.length > 0 ? users.map((user, index) => {
                                return <div className='col-12 mb-2' key={user._id}>
                                    <label>{user.email}</label>
                                    <button
                                        className='btn btn-outline-primary ms-2'
                                        onClick={() => setMutualFriendId(user._id)}
                                    >
                                        Mutual Friends
                                    </button>
                                    {user.isAccepted === true &&
                                        <button className="btn btn-success ms-2" disabled>Accepted</button>
                                    }
                                    {user.isAccepted === false &&
                                        <button className="btn btn-danger ms-2" disabled>Rejected</button>
                                    }
                                    {user.isAccepted === undefined &&
                                        <>
                                            <button className="btn btn-success ms-2" onClick={() => onResponse(user, true, index)}>Accept</button>
                                            <button className="btn btn-danger ms-2" onClick={() => onResponse(user, false, index)}>Reject</button>
                                        </>
                                    }
                                </div>
                            })
                                :
                                <div>No request found.</div>
                            }
                        </div>
                        :
                        <div className='mt-3'>
                            <MutualFriends close={() => setMutualFriendId(false)} mutualFriendId={mutualFriendId}/>
                        </div>
                    }
                </>
            }
        </div>
    </div>
}

export default RequestList