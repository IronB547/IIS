import { defineStore } from 'pinia'
import config from '@/services/config'

export const useRequestsStore = defineStore('requests', {
    state: () => ({
        // products: [ , , ],
        requests: [],
    }),
    getters: {   
    },
    actions: {
        async createRequest(request) {
            if(!localStorage.getItem("user"))
                return {error: "You must be logged in to create a request"}

            const res = await fetch(`${config.host}/requests/`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user"))?.token
                },
                body: JSON.stringify(request)
            })

            if(res.status === 201){
                this.requests.push(request)
                return {message: "Request created successfully"}
            }else{
                return {error: "Request creation failed"}
            }


        },

        async addComment(requestId, comment) {
            if(!localStorage.getItem("user"))
                return {error: "You must be logged in to add a comment"}

            const res = await fetch(`${config.host}/requests/${requestId}/comments`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user"))?.token
                },
                body: JSON.stringify(comment)
            })

            if(res.status === 201){
                return {message: "Comment added successfully"}
            }else{
                return {error: "Comment addition failed"}
            }

        }
    }
})