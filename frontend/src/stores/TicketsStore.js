import { defineStore } from 'pinia'
import config from '@/services/config'
import ticketsService from '@/services/ticketsService'
import queryString from 'query-string'

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

        async getBySearch(page = 1, query, onlyCount = false){
            let queryStr = queryString.stringify(query)

            let mode = onlyCount ? "count" : "list"

            const res = await fetch(`${config.host}/tickets/${mode}/${page}?orderBy=createdAt&order=DESC&${queryStr}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user"))?.token
                }
            })
        
            return res.json()
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
                return {error: "Musíte být přihlášení abyste mohli vytvořit ticket"}

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
                return {message: "Ticket úspěšně vytvořen"}
            }else{
                return {error: "Vytvoření ticketu selhalo"}
            }
        },

        async addComment(ticketId, comment) {
            if(!localStorage.getItem("user"))
                return {error: "Musíte být přihlášení abystě mohli přidat komentář"}

            const res = await fetch(`${config.host}/tickets/${ticketId}/comments`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user"))?.token
                },
                body: JSON.stringify(comment)
            })

            if(res.status === 201){
                return {message: "Komentář úspěšně přidán"}
            }else if(res.status === 204){
                return {error: "Nemůžete přidat komentář"}
            }else{
                return {error: "Přidání komentáře selhalo"}
            }

        },

        async editComment(ticketId, commentId, comment) {
            if(!localStorage.getItem("user"))
                return {error: "Musíte být přihlášení pro editaci komentářů"}

            const res = await fetch(`${config.host}/tickets/${ticketId}/comments/${commentId}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user"))?.token
                },
                body: JSON.stringify(comment)
            })

            if(res.status === 204){
                return {message: "Komentář úspěšně změněn"}
            }else if(res.status === 403){
                return {message: "Nemůžete editovat komentář"}
            }else{
                return {error: "Editace komentáře selhala"}
            }

        },

        async deleteTicket(ticketID) {
            if(!localStorage.getItem("user"))
                return {error: "Musíte být přihlášení abyste mohli smazat ticket"}

            const res = await fetch(`${config.host}/tickets/${ticketID}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user"))?.token
                },
            })

            if(res.status === 204){
                return {message: "Ticket úspěšně smazán"}
            }else if(res.status === 403) {
                return {error: "Nemůžete smazat ticket"}
            }
            else{
                return {error: "Smazání ticketu selhalo"}
            }
        },

        async deleteComment(commentId) {
            if(!localStorage.getItem("user"))
                return {error: "Musíte být přihlášení abyste mohli smazat komentář"}

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