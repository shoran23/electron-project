export default class LgBasic {
    constructor(id) {
        this.id = id
        this.lastCommand = null
        this.delimter = '\r'
        this.status = {
            power: '',
            input: ''
        }
        this.states = {
            power: [
                {label: 'power on', value: '01'},
                {label: 'power off', value: '00'}
            ],
            inputs: [
                {label: 'component', value: '40'},
                {label: 'rgb', value: '60'},
                {label: 'dvi-d', value: '80'},
                {label: 'hdmi1', value: '90'},
                {label: 'hdmi2', value: '91'},
                {label: 'displayport', value: 'C0'}
            ]
        }
    }
    returnCommand = (command) => {
        this.lastCommand = command
        return command
    }
    /* POWER ********************************************************************/
    setPower = selectedPower => {
        for(const power of this.states.power) {
            if(power.label === selectedPower.toLowerCase()) {
                return this.returnCommand(`ka ${this.id} ${power.value}\r`)
            }
        }
    }
    /* INPUT ********************************************************************/
    setInputSelection = selectedInput => {
        for(const input of this.states.inputs) {
            if(input.label === selectedInput.toLowerCase()) {
                return this.returnCommand(`xb ${this.id} ${input.value}${this.delimter}`)
            }
        }
    }
    /* STATUS *********************************************************************/
    returnStatus = () => {
        return this.status
    }
    /* PARSING ********************************************************************/ 
    parseResponse = data => {
        if(data.search('x') > -1) {
            let response = data.substring(0,data.length - 1)
            let id = response.substring(2,4)
            if(this.id === id) {
                if(response.search('a') > -1) {
                    if(response.search('OK') > -1) {
                        let inputResponse = response.substring(7,9)
                        for(const power of this.states.power) {
                            if(inputResponse === power.value) {
                                this.status.power = power.label
                                break;
                            }
                        }
                    } 
                } else if(response.search('b') > -1) {
                    if(response.search('OK') > -1) {
                        let inputResponse =  response.substring(7,9)
                        for(const input of this.states.inputs) {
                            if(inputResponse === input.value) {
                                this.status.input = input.label
                                break;
                            }
                        }
                    }
                }
            }
            return this.status
        }
    }
}