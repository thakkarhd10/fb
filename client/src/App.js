import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import MyFriendList from './components/MyFriendList'
import RequestList from './components/RequestList'
import SuggestionList from './components/SuggestionList'
import { setAuthToken } from './utils'

function App() {
    const navigate = useNavigate()

    const [page, setPage] = useState('suggestion-list')

    useEffect(() => {
        if (localStorage.token) {
            setAuthToken(localStorage.token)
        } else {
            navigate('/login')
        }
    }, [navigate])

    const onLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    const email = useMemo(() => {
        return localStorage.getItem('email')
    }, [])

    return (<>
        <div className='text-end m-3'>
            <label>My Email : {email}</label>
            <button className='ms-2 btn btn-danger' onClick={onLogout}>Logout</button>
        </div>
        <div className="text-center">
            <button className={`btn m-2 ${page === 'suggestion-list' ? 'btn-dark' : 'btn-light'}`} onClick={() => setPage('suggestion-list')}>Suggestion List</button>
            <button className={`btn m-2 ${page === 'friend-list' ? 'btn-dark' : 'btn-light'}`} onClick={() => setPage('friend-list')}>My Friend List</button>
            <button className={`btn m-2 ${page === 'request-list' ? 'btn-dark' : 'btn-light'}`} onClick={() => setPage('request-list')}>Friend Request</button>
        </div>
        {page === 'suggestion-list' &&
            <SuggestionList />
        }
        {page === 'friend-list' &&
            <MyFriendList />
        }
        {page === 'request-list' &&
            <RequestList />
        }
    </>
    )
}

export default App;
