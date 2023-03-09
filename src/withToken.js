import { useRouter } from "next/router";
import { keys } from "../src/config";
import { useUser } from "./contexts/UserContext";


const withToken = (Component) => {
    return (props) => {
        if (typeof window !== 'undefined') {
            const router = useRouter()
            const [info, setInfo] = useUser()
            
                if(router.pathname === '/'){
                    if(!info.user){
                        router.replace('/login')
                    }else{
                        router.replace('/dashboard')
                    }
                    return null ;
                }
                
                if(!info.user){
                    router.replace('/login')
                    return null ;
                }
            return <Component {...props} />
        }
        return null ;
    }
}

export default withToken;