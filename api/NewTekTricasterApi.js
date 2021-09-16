export let triggerMacro = (address,name) => {
    fetch(`http://${address}/v1/trigger?name=${name}`, {
        
    })
}