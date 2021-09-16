export let login = (address,id,pass) => {
    fetch(`http://${address}/mwapi?method=login&id=${id}&pass=${pass}`)
    .then(res => {
        if(!res.ok) {
            throw Error(res.statusText)
        }
        res.json()
    })
    .then(resJson => {
        return resJson
    })
    .catch(err => console.log('err', err))
}
export let logout = (address) => {
    fetch(`http://${address}/mwapi?method=logout`)
    .then(res => {
        if(!res.ok) {
            throw Error(res.statusText)
        }
        res.json()
    })
    .then(resJson => {
        return resJson
    })
    .catch(err => console.log('err ',err))
}
export let setChannel = (address,name) => {
    fetch(`http://${address}/mwapi?method=set-channel&ndi-name=true&name=${name}`)
    .then(res => {
        if(!res.ok) {
            throw Error(res.statusText)
        }
        res.json()
    })
    .then(resJson => {
        return resJson
    })
    .catch(err => console.log('err = ',err))
}
export let getChannel = (address) => {
    fetch(`http://${address}/mwapi?method=get-channel`)
    .then(res => {
        if(!res.ok) {
            throw Error(res.statusText)
        }
        res.json()
    })
    .then(resJson => {
        return resJson
    })
    .catch(err => console.log('err = ',err))
}
export let getSources = (address) => {
    fetch(`http://${address}/mwapi?method=get-ndi-sources`)
    .then(res => {
        if(!res.ok) {
            throw Error(res.statusText)
        }
        res.json()
    })
    .then(resJson => {
        return resJson
    })
    .catch(err => console.log('err = ',err))
}
export let getSignalInfo = address => {
    fetch(`http://${address}/mqapi?method=get-signal-info`)
    .then(res => {
        if(!res.ok) {
            throw Error(res.statusText)
        }
        res.json()
    })
    .then(resJson => {
        return resJson
    })
    .catch(err => console.log('err = ',err))
}


