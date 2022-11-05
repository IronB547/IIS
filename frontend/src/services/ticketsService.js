import config from './config'

async function getBySearch() {
    const res = await fetch('http://localhost:10000/tickets/search', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        }
    })

    return res.json()
}

async function getTicket(id) {
    console.log(`${config.host}/tickets/${id}`)
    const res = await fetch(`${config.host}/tickets/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem("token")
        }
    })

    return res.json()
}

export default {
    getBySearch,
    getTicket
}