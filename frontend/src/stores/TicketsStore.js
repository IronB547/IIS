import { defineStore } from 'pinia'
import config from '@/services/config'

export const useTicketsStore = defineStore('tickets', {
    state: () => ({
        // products: [ , , ],
        tickets: [],
    }),
    getters: {   
    },
    actions: {
        async createTicket(ticket) {

            const res = await fetch(`${config.host}/tickets/`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token
                },
                body: JSON.stringify(ticket)
            })

            this.tickets.push(ticket)
            return res.json()

        }
    }
})