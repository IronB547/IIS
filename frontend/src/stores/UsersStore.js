import { defineStore } from 'pinia'
import config from '@/services/config'

export const useUsersStore = defineStore('user', {
    state: () => ({
        // products: [ , , ],
        users: [],
    }),
    getters: {   
        getUser: (state, id) => state.user.find(user => user.id === id),
    },
    actions: {
        async getUsers(userType = null, page = 1) {
            const res = await fetch(`${config.host}/users/all/${page}?userType=${userType}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user"))?.token
                },
            })

            if(res.status === 200){
                const users = await res.json()
                return users.data
            }else{
                return {error: "Failed to get users"}
            }
        }
    }
})