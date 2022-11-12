import config from "./config"

async function logIn(credentials){
    const res = await fetch(`${config.host}/users/login`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(credentials)
    })
    const data = await res.json()
    if(data.token){
        localStorage.setItem("user",JSON.stringify(data))
        console.log(data)
    }
    return data;
}

async function register(credentials){
    
    delete credentials.passwordRepeat
    credentials.phoneNum = credentials.phoneNum.replace(/ /g,'') 

    const res = await fetch(`${config.host}/users`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(credentials)
    })
    const data = await res.json()
    // if(data.token){
    //     localStorage.setItem("token",{token: data.token})
    //     console.log(data)
    // }

    return data;
}

export default {
    logIn,
    register,
}