import { defineStore } from 'pinia'
import userService from '@/services/userService'
import router from '@/router'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        // products: [ , , ],
        user: JSON.parse(localStorage.getItem('user')),
        displayMode: localStorage.getItem('displayMode') || ((window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light'),
    }),
    getters: {   
        getUser: (state) => state.user,

        getUserData: (state) => {
            if(!state.user)
                return null
            if(!state.user?.data)
                return null
            return state.user?.data
        },

        isLoggedIn: (state) => !!state.user,

        getToken: (state) => state.user.token,

        hasRole: (state) => (role) => state.getUserData?.userType >= role,
    },
    actions: {
        async logIn(credentials) {
            this.user = {loading: true}
            this.user = await userService.logIn(credentials)
            return this.user
        },
        async register(credentials) {
            this.user = {loading: true}
            const res = await userService.register(credentials)
            if(res.status === 201)
                this.user = await this.logIn({email: credentials.email,password: credentials.password})
            return res
        },
        logOut() {
            localStorage.removeItem("user")
            this.user = null
            router.push('/login')
        },
        setDisplayMode(mode) {
            this.displayMode = mode
            localStorage.setItem('displayMode', mode)
        },
        removeDisplayMode() {
            this.displayMode = null
            localStorage.removeItem('displayMode')
        }
    }
})