import { defineStore } from 'pinia'
import config from '@/services/config'
import requestsService from '@/services/requestService'
import QueryString from 'query-string'

export const useRequestsStore = defineStore('requests', {
    state: () => ({
        // products: [ , , ],
        requests: [],
    }),
    getters: {   
    },
    actions: {

        async getBySearch(page = 1,query, onlyCount = false){
            let queryStr = QueryString.stringify(query)

            let mode = onlyCount ? "count" : "list"
            const res = await fetch(`${config.host}/requests/${mode}/${page}?orderBy=createdAt&order=DESC&${queryStr}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token
                }
            })
        
            return res.json()
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
                return {error: "Musíte být přihlášení pro vytvoření požadavku"}

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
                return {message: "Požadavek úspěšně vytvořen"}
            }else{
                return {error: "Vytvoření požadavku selhalo"}
            }


        },

        async addComment(requestId, comment) {
            if(!localStorage.getItem("user"))
                return {error: "Musíte být přihlášení abyste mohli přidat komentář"}

            const res = await fetch(`${config.host}/requests/${requestId}/comments`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user"))?.token
                },
                body: JSON.stringify(comment)
            })

            if(res.status === 201){
                return {message: "Komentář byl úspěšně přidán"}
            }else{
                return {error: "Přidání komentáře selhalo"}
            }

        },

        async addTechnician(requestId, technicianId) {
            if(!localStorage.getItem("user"))
                return {error: "Musíte být přihlášení abyste mohli odebrat technika"}

            const res = await fetch(`${config.host}/requests/${requestId}/technicians/${technicianId}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user"))?.token
                }
            })

            if(res.status === 204){
                return {message: "Technik byl úspěšně přiřazen"}
            }else if(res.status === 403) {
                return {error: "Přiřazení technika selhalo"}
            }else{
                return {error: "Přiřazení technika selhalo"}
            }

        },
        async removeTechnician(requestId, technicianId) {
            if(!localStorage.getItem("user"))
                return {error: "Musíte být přihlášení abyste mohli odebrat technika"}
            
            const res = await fetch(`${config.host}/requests/${requestId}/technicians/${technicianId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user"))?.token
                }
            })

            if(res.status === 204){
                return {message: "Odebrání technika bylo úspěšné"}
            }else{
                return {error: "Nemůžete odebrat technika"}
            }
        },

        async deleteRequest(requestID) {
            if(!localStorage.getItem("user"))
                return {error: "Musíte být přihlášení abyste mohli smazat požadavek"}

            const res = await fetch(`${config.host}/requests/${requestID}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user"))?.token
                }
            })

            if(res.status === 204){
                return {message: "Požadavek úspěšně smazán"}
            }else if(res.status === 403) {
                return {error: "Nemůžete smazat požadavek"}
            }else{
                return {error: "Smazání požadavku selhalo"}
            }
        },

        async deleteComment(commentId) {
            if(!localStorage.getItem("user"))
                return {error: "Musíte být přihlášení abyste mohli smazat komentář"}

            const res = await fetch(`${config.host}/requests/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user"))?.token
                }
            })

            if(res.status === 204){
                return {message: "Komentář úspěšně smazán"}
            }else if(res.status === 403) {
                return {error: "Nemůžete smazat cizí komentář"}
            }else{
                return {error: "Smazání komentáře selhalo"}
            }
        },

        async editComment(commentId, comment) {
            if(!localStorage.getItem("user"))
                return {error: "Musíte být přihlášení abyste mohli editovat komentář"}

            const res = await fetch(`${config.host}/requests/comments/${commentId}`, {
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
                return {error: "Nemůžete editovat cizí komentář"}
            }else{
                return {error: "Editace komentáře selhala"}
            }
        },
    }
})