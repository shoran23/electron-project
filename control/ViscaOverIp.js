export default class ViscaOverIp {
    constructor(id,panSpeed,tiltSpeed,zoomSpeed) {
        this.id = String.fromCharCode(id + 128)
        this.panSpeed = String.fromCharCode(panSpeed)
        this.tiltSpeed = String.fromCharCode(tiltSpeed)
        this.zoomSpeed = zoomSpeed
        this.lastCommand = null
        this.lastCommandName = ''
        this.delimiter = String.fromCharCode(0xFF)
        this.status = {
            power: '',
            preset: 0
        }
        this.commands = {
            panTilt: [
                {name: 'up', value: [0x03, 0x01]},
                {name: 'down', value: [0x03,0x02]},
                {name: 'left', value: [0x01,0x03]},
                {name: 'right', value: [0x02,0x03]},
                {name: 'upleft', value: [0x01,0x01]},
                {name: 'upright', value: [0x02,0x01]},
                {name: 'downleft', value: [0x01,0x02]},
                {name: 'downright',value: [0x02,0x02]},
                {name: 'stop', value: [0x03,0x03]}
            ],
            zoom: [
                {name: 'in', value: 0x20 + this.zoomSpeed},
                {name: 'out', value: 0x30 + this.zoomSpeed},
                {name: 'stop', value: 0x00}
            ],
            presets: [
                {name: 'recall', value: 0x02},
                {name: 'store', value: 0x01}
            ],
            power: [
                {name: 'on', value: 0x02},
                {name: 'standby', value: 0x03}
            ]
        }
    }
    /* RETURN COMMAND ****************************************************/
    returnCommand = (command,commandName) => {
        let header = String.fromCharCode(0x01) + String.fromCharCode(0x00) + String.fromCharCode(0x00) + String.fromCharCode(0x09) + String.fromCharCode(0x00) + String.fromCharCode(0x00) + String.fromCharCode(0x00) + String.fromCharCode(0x00)
        this.lastCommand = `${this.id}${command}${this.delimiter}`
        this.lastCommandName = commandName
        return header + this.lastCommand
    }
    /* PAN TILT **********************************************************/
    setPanTilt = action => {
        let header = String.fromCharCode(0x01) + String.fromCharCode(0x06) + String.fromCharCode(0x01)
        for(const command of this.commands.panTilt) {
            if(command.name === action.toLowerCase()) {
                return this.returnCommand(header + this.panSpeed + this.tiltSpeed + String.fromCharCode(command.value[0]) + String.fromCharCode(command.value[1]),command.name)
            }
        }
    }
    /* ZOOM ***************************************************************/
    setZoom = action => {
        let header = String.fromCharCode(0x01) + String.fromCharCode(0x04) + String.fromCharCode(0x07)
        for(const command of this.commands.zoom) {
            if(command.name === action.toLowerCase()) {
                return this.returnCommand(header + String.fromCharCode(command.value),command.name)
            }
        }
    }
    /* PRESETS *************************************************************/
    setPreset = (action,preset) => {
        let header = String.fromCharCode(0x01) + String.fromCharCode(0x04) + String.fromCharCode(0x3F)
        for(const command of this.commands.presets) {
            if(command.name === action.toLowerCase()) {
                this.status.preset = preset
                return this.returnCommand(header + command.value + String.fromCharCode(preset),command.name)
            }
        }
    }
    viewLastRecalledPreset = () => {
        let body = String.fromCharCode(0x09) + String.fromCharCode(0x04) + String.fromCharCode(0x3F)
        return this.returnCommand(body,'view last recall')
    }
    /* POWER ****************************************************************/
    setPower = action => {
        let header = String.fromCharCode(0x01) + String.fromCharCode(0x04) + String.fromCharCode(0x00)
        for(const command of this.commands.power) {
            if(command.name === action.toLowerCase()) {
                return this.returnCommand(header + String.fromCharCode(command.value),command.name)
            }
        }
    }
    viewPowerStatus = () => {
        let body = String.fromCharCode(0x09) + String.fromCharCode(0x04) + String.fromCharCode(0x00)
        return this.returnCommand(body,'view power status')
    }
    /* STATUS ***************************************************************/
    returnStatus = () => {
        return this.status
    }
    /* PARSING ***************************************************************/
    parseResponse = data => {
        if(data.search(String.fromCharCode(0xFF)) > -1) {
            let response = data
            switch(this.lastCommandName) {
                case 'view power status': {
                    let powerStatus = response.substring(2,3)
                    if(powerStatus === String.fromCharCode(0x02)) {
                        this.status.power = 'on'
                    } else if(powerStatus === String.fromCharCode(0x03)) {
                        this.status.power = 'standby'
                    }
                    break
                }
                case 'view last recall': {
                    let presetStatus = response.substring(2,3)
                    let preset = presetStatus.charCodeAt(0)
                    this.status.preset = preset
                    break
                }
            }
            return this.status
        }
    }
}