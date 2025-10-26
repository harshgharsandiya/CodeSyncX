import axios from 'axios'

// IMPORTANT: Replace this with your actual backend URL
const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

/*
  Note: We're setting the Authorization header dynamically 
  in the AuthContext (src/context/AuthContext.tsx)
  when the user logs in or on initial app load.
*/

export default api
