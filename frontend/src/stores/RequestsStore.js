import { defineStore } from 'pinia'
import config from '@/services/config'
import requestsService from '@/services/requestService'

export const useRequestsStore = defineStore('requests', {
    state: () => ({
        // products: [ , , ],
        requests: [],
    }),
    getters: {   
    },
    actions: {

        async getBySearch(){
            return requestsService.getAll()
        },

        async getServiceRequest(id){
            return requestsService.getServiceRequest(id)
        },

        async changeState(request, state) {
            if(request.solutionState == state)
                return {warn: "Stav je již nastaven"}
            
            request.solutionState = state

            const res = await fetch(`${config.host}/requests/${request.id}/`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user"))?.token
                },
                body: JSON.stringify(request)
            })

            if(res.status === 204){
                this.requests.push(request)
                return {message: "Úspěšně změněn stav ticketu"}
            }else if(res.status === 403) {
                return {error: "Nemůžete změnit stav ticketu"}
            }else{
                return {error: "Změna stavu ticketu selhala"}
            }
        },

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

        },

        async addTechnician(requestId, technicianId) {
            if(!localStorage.getItem("user"))
                return {error: "You must be logged in to assign a technician"}

            const res = await fetch(`${config.host}/requests/${requestId}/technicians/${technicianId}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user"))?.token
                }
            })

            if(res.status === 204){
                return {message: "Technician assigned successfully"}
            }else{
                return {error: "Technician assignment failed"}
            }

        },
        async removeTechnician(requestId, technicianId) {
            if(!localStorage.getItem("user"))
                return {error: "You must be logged in to remove a technician"}
            
            const res = await fetch(`${config.host}/requests/${requestId}/technicians/${technicianId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user"))?.token
                }
            })

            if(res.status === 204){
                return {message: "Technician removed successfully"}
            }else{
                return {error: "Technician removal failed"}
            }
        },

        async deleteComment(commentId) {
            if(!localStorage.getItem("user"))
                return {error: "You must be logged in to delete a comment"}

            const res = await fetch(`${config.host}/requests/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user"))?.token
                }
            })

            if(res.status === 204){
                return {message: "Comment deleted successfully"}
            }else{
                return {error: "Comment deletion failed"}
            }
        },

        async editComment(commentId, comment) {
            if(!localStorage.getItem("user"))
                return {error: "You must be logged in to edit a comment"}

            const res = await fetch(`${config.host}/requests/comments/${commentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user"))?.token
                },
                body: JSON.stringify(comment)
            })

            if(res.status === 204){
                return {message: "Comment edited successfully"}
            }else{
                return {error: "Comment edition failed"}
            }
        },
    }
})