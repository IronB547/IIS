import config from './config'


async function getAll() {
    const res = await fetch(`${config.host}/requests/list/?orderBy=createdAt&order=DESC`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token
        }
    })

    return res.json()
}

async function getServiceRequest(id) {
    const res = await fetch(`${config.host}/requests/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token
        }
    })

    return res.json()
}


export default {
    getAll,
    getServiceRequest,
}