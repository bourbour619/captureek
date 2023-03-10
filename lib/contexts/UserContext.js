import React, {  useState, useEffect, useContext , createContext } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'

const UserContext = createContext()

export const useUser = () => {
    return useContext(UserContext)
}

export const UserProvider = ({children}) => { 
    const [user, setUser] = useState({})
    const [token, setToken] = useLocalStorage('token', {})

    useEffect(() => {
        if(user.token && !token){
            setToken(user.token)
        }
    },[user])

    return (
        <UserContext.Provider value={[user, setUser]}>
            {children}
        </UserContext.Provider>
    )
}