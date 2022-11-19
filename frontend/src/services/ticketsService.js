import config from './config'

async function getBySearch() {

}

async function getTicket(id) {
    console.log(`${config.host}/tickets/${id}`)
    const res = await fetch(`${config.host}/tickets/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user"))?.token
        }
    })

    return res.json()
}

export default {
    getBySearch,
    getTicket
}