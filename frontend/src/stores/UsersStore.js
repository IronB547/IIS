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
            const res = await fetch(`${config.host}/users/all/${page}${userType ? "?userType="+userType: ""}`, {
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
        },

        async createUser(user) {
            const res = await fetch(`${config.host}/users`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user"))?.token
                },
                body: JSON.stringify(user)
            })

            if(res.status === 201){
                const user = await res.json()
                return user
            }else{
                return {error: "Failed to create user"}
            }
        },

        async removeUser(id) {
            const res = await fetch(`${config.host}/users/${id}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user"))?.token
                },
            })

            if(res.status === 204){
                return {success: "User deleted"}
            }else{
                return {error: "Failed to delete user"}
            }
        },

        async editUser(id,user) {
            const res = await fetch(`${config.host}/users/${id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user"))?.token
                },
                body: JSON.stringify(user)
            })

            if(res.status === 204){
                return {message: "User edited"}
            }else{
                return {error: "Failed to edit user"}
            }
        },

    }
})