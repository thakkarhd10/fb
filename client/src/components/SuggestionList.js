import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { getAppBaseUrl } from '../utils'
import MutualFriends from './MutualFriends'

const BASE_URL = getAppBaseUrl()

function SuggestionList() {

    const [suggestionsUsers, setSuggestionsUsers] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [mutualFriendId, setMutualFriendId] = useState(false)

    const idRef = useRef(mutualFriendId)

    useEffect(() => {
        getUserList()
        const interval = setInterval(() => {
            getUserList()
        }, 60 * 1000)

        return () => clearInterval(interval)
    }, [])

    const getUserList = async () => {
        if (idRef.current === false) {
            const url = BASE_URL + '/api/get-suggestion-user-list'
            const userId = localStorage.token
            const data = {
                userId
            }
            try {
                setIsLoading(true)
                const res = await axios.post(url, data)
                setSuggestionsUsers(res.data.data)
                setIsLoading(false)
            } catch (err) {
                setIsLoading(false)
                const errorMessage = err.response.data.message || 'something went wrong'
                alert(errorMessage)
            }
        }
    }

    const sentRequest = async (user, index) => {
        const userId = localStorage.token

        const data = {
            userId,
            receiver_id: user._id
        }
        const url = BASE_URL + '/api/send-friend-request'
        try {
            const res = await axios.post(url, data)
            if (res.data.is_success) {
                const copyList = [...suggestionsUsers]
                copyList[index].isSentRequest = true
                setSuggestionsUsers(copyList)
            }
        } catch (err) {
            setIsLoading(false)
            const errorMessage = err.response.data.message || 'something went wrong'
            alert(errorMessage)
        }
    }

    const onChangeMutualId = (data) => {
        setMutualFriendId(data)
        idRef.current = data
    }
    return <div className='container'>
        <div className='row text-center'>
            {isLoading ?
                <label className='mt-3'>Loading</label>
                :
                <>
                    {mutualFriendId === false ?
                        <div className='mt-3'>
                            {suggestionsUsers.length > 0 ? suggestionsUsers.map((user, index) => {
                                return <div className='col-12 mb-2' key={user._id}>
                                    <label>{user.email}</label>
                                    <button className='btn btn-outline-primary ms-2' onClick={() => onChangeMutualId(user._id)}>Mutual Friends</button>
                                    {user.isSentRequest === true ?
                                        <button className="btn btn-primary ms-2" disabled>Sent</button>
                                        :
                                        <button className="btn btn-outline-success ms-2" onClick={() => sentRequest(user, index)}>Send Request</button>
                                    }
                                </div>
                            })
                                :
                                <div>No suggestion found.</div>
                            }
                        </div>
                        :
                        <div className='mt-3'>
                            <MutualFriends close={() => onChangeMutualId(false)} mutualFriendId={mutualFriendId} />
                        </div>
                    }
                </>
            }
        </div>
    </div>
}

export default SuggestionList