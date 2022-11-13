import { defineStore } from 'pinia'
import userService from '@/services/userService'
import router from '@/router'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        // products: [ , , ],
        user: JSON.parse(localStorage.getItem('user')),
    }),
    getters: {   
        getUser: (state) => state.user,

        isLoggedIn: (state) => !!state.user,

        getToken: (state) => state.user.token,
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
    }
})