import React, { useState, useEffect } from 'react'

export default function useLocalStorage (key,iv){
    const [value, setValue] = useState(() => {
        if(typeof window !== 'undefined'){
            return localStorage.getItem(key)
        }
        return iv
    })

    useEffect(() => {
        if(value && typeof window !== 'undefined'){
            localStorage.setItem(key, JSON.stringify(value))
        }
    },[value])

    return [value, setValue]
}