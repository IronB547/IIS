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

        async showRequests(ticketID){
            const res = await fetch(`${config.host}/requests/list/?orderBy=createdAt&order=DESC&ticketID=${ticketID}/`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user"))?.token
                },
            })

            if(res.status === 200){
                return res.json
            }else{
                return {error: "Failed to load service requests"}
            }
        },

        async changeState(ticket, state) {
            if(ticket.status == state)
                return {warn: "Stav je již nastaven"}
            
            ticket.status = state

            const res = await fetch(`${config.host}/tickets/${ticket.id}/`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user"))?.token
                },
                body: JSON.stringify(ticket)
            })
            
            if(res.status === 204){
                this.tickets.push(ticket)
                return {message: "Úspěšně změněn stav ticketu"}
            }else if(res.status === 403) {
                return {error: "Nemůžete změnit stav ticketu"}
            }else{
                return {error: "Změna stavu ticketu selhala"}
            }
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
                return {message: "Komentář úspěšně smazán"}
            }else{
                return {error: "Smazání komentáře selhalo"}
            }

        }
    }
})