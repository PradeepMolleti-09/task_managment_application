import { createContext, useEffect, useState } from "react"
import axios from "axios"

export const AppContent = createContext()

const AppContextProvider = ({ children }) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [userData, setUserData] = useState(null)
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    axios.defaults.withCredentials = true

    const getUserData = async () => {
        try {
            const { data } = await axios.get(
                `${backendUrl}/api/auth/isAuth`,
                { withCredentials: true }
            )

            if (data.success) {
                setUserData(data.user)
                setIsLoggedIn(true)
            } else {
                setUserData(null)
                setIsLoggedIn(false)
            }
        } catch (error) {
            setUserData(null)
            setIsLoggedIn(false)
        }
    }

    // Restore session on refresh
    useEffect(() => {
        getUserData()
    }, [])

    return (
        <AppContent.Provider
            value={{
                backendUrl,
                userData,
                setUserData,
                isLoggedIn,
                setIsLoggedIn,
                getUserData
            }}
        >
            {children}
        </AppContent.Provider>
    )
}

export default AppContextProvider
