import { defineStore } from 'pinia'
import config from '@/services/config'
import ticketsService from '@/services/ticketsService'

export const useTicketsStore = defineStore('tickets', {
    state: () => ({
        // products: [ , , ],
        tickets: [],
    }),
    getters: {   
    },
    actions: {

        async getTicket(ticketId){
            return ticketsService.getTicket(ticketId)
        },

        async getBySearch(){
            return ticketsService.getBySearch()
        },

        async createTicket(ticket) {
            if(!localStorage.getItem("user"))
                return {error: "You must be logged in to create a ticket"}

            const res = await fetch(`${config.host}/tickets/`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user"))?.token
                },
                body: JSON.stringify(ticket)
            })

            if(res.status === 201){
                this.tickets.push(ticket)
                return {message: "Ticket created successfully"}
            }else{
                return {error: "Ticket creation failed"}
            }


        },

        async addComment(ticketId, comment) {
            if(!localStorage.getItem("user"))
                return {error: "You must be logged in to add a comment"}

            const res = await fetch(`${config.host}/tickets/${ticketId}/comments`, {
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

        async editComment(ticketId, commentId, comment) {
            if(!localStorage.getItem("user"))
                return {error: "You must be logged in to edit a comment"}

            const res = await fetch(`${config.host}/tickets/${ticketId}/comments/${commentId}`, {
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

        async deleteComment(commentId) {
            if(!localStorage.getItem("user"))
                return {error: "You must be logged in to delete a comment"}

            const res = await fetch(`${config.host}/tickets/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user"))?.token
                },
            })

            if(res.status === 204){
                return {message: "Comment deleted successfully"}
            }else{
                return {error: "Comment deletion failed"}
            }

        }
    }
})