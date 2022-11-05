import config from "./config"

async function logIn(credentials){
    const res = await fetch(`${config.host}/users/login`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(credentials)
    })
    const data = await res.json()
    if(data.token){
        localStorage.setItem("token",data.token)
        // this.$toast.add({
        //     severity: "success",
        //     summary: "Successfully logged in",
        //     detail: "Message Content",
        //     life: 3000,
        // });
        console.log(data)
    }else{
        // this.$toast.add({
        //     severity: "error",
        //     summary: "Wrong credentials",
        //     detail: "The email or password is incorrect",
        //     life: 3000,
        // });
        console.log(data)
        // this.response = data
    }
    return data;
}

export default {
    logIn,
}