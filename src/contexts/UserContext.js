import axios from 'axios'
import React, {  useState, useEffect, useContext , createContext } from 'react'
import { keys } from '../config'
import useLocalStorage from '../hooks/useLocalStorage'
import { useRouter } from 'next/router'

const UserContext = createContext()

export const useUser = () => {
    return useContext(UserContext)
}

export const UserProvider = ({children}) => { 
    const [info, setInfo] = useState({})
    const [token, setToken] = useLocalStorage('token', {})
    const router = useRouter()

    useEffect(() => {
        if(info.token){
            localStorage.setItem('token', info.token)
        }
    },[info])

    useEffect(() => {
        const token = localStorage.getItem('token')
        if(token){
            axios.get(`${keys.serverURI}/users/verify/`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${ token }`
                }
            })
                .then(res => {
                    if(res.data){
                        setInfo({
                            ...info,
                            ...res.data
                        })
                        router.replace('/dashboard')
                    }
                })
                .catch(err => {
                    setInfo({})
                    if(router.pathname === 'dashboard'){
                        router.replace('/login')
                    }
                })
        }
    },[])

    return (
        <UserContext.Provider value={[info, setInfo]}>
            {children}
        </UserContext.Provider>
    )
}