import axios from "axios";
import { useEffect, useState } from "react";
import { apiUrl } from "../config";
import { useUser } from "../contexts/UserContext";
import useLocalStorage from "./useLocalStorage";


export default function useGuard(){
    const [ok, setOk] = useState()
    const [user, setUser] = useUser()
    const [token, setToken] = useLocalStorage('token', {})
    

    useEffect(async() => {
        if(!token){
            setOk(false)
            return
        }
        const res = await axios.get(`${apiUrl}/users/verify/`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${ token }`
            }
        })
        if(res.status == 200) {
            setUser({...user, ...res.data.user, ...res.data.token})
            setOk(true)
        } else {
            setUser({})
            setOk(false)
        }
    }, [token])

   

    return ok
}