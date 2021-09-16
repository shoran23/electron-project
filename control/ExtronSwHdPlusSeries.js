export default class ExtronSwHd4kPlusSeries {
    constructor(numberOfInputs) {
        this.numberOfInputs = numberOfInputs
        this.lastCommand = null
        this.delimiter = '\r'
        this.status = {
            input: 0,
            videoMute: 0,
            audioMute: 0,
            autoSwitchMode: 0,
            inputs: [],
            outputHdcpStatus: 0,
            outputHdcpMode: 0
        }
        for(let inputIndex=0;inputIndex<this.numberOfInputs;inputIndex++) {
            this.status.inputs.push({
                label: `HDMI ${inputIndex + 1}`,
                signalStatus: 0,
                hdcpAuthorization: 0,
                hdcpStatus: 0
            })
        }
    }
    returnCommand = (command) => {
        this.lastCommand = command
        return command
    }
    /* INPUT SELECTION *****************************************************************/
    setInputSelection = (input) => {
        this.returnCommand(`${input}!`)
    }
    viewInputSelection = () => {
        this.returnCommand(`!`)
    }
    /* MUTING ***************************************************************************/
    setVideoMute = mute => {
        this.returnCommand(`${mute}B`)
    }
    viewVideoMute = () => {
        this.returnCommand(`B`)
    }
    setAudioMute = mute => { 
        this.returnCommand(`${0x1B}${mute}AFMT${this.delimiter}`)
    }
    viewAudioMute = () => {
        this.returnCommand(`${0x1B}AMFT${this.delimiter}`)
    }
    /* AUTO INPUT SWITCH MODE ***********************************************************/
    setAutoInputSwitchMode = mode => {
        this.returnCommand(`${0x1B}AUSW${mode}${this.delimiter}`)
    }
    viewAutoInputSwitchMode = () => {
        this.returnCommand(`${0x1B}AUSW${this.delimiter}`)
    }
    /* HDCP ****************************************************************************/
    setInputHdcpAuthorization = (input,authorization) => {
        this.returnCommand(`${0x1B}E${input}*${authorization}${this.delimiter}`)
    }
    setOutputHdcpAuthorization = mode => {
        this.returnCommand(`${0x1B}S${mode}HDCP${this.delimiter}`)
    }
    viewInputHdcpStatus = (input) => {
        this.returnCommand(`${0x1B}I${input}HDCP${this.delimiter}`)
    }
    viewOutputHdcpStatus = () => {
        this.returnCommand(`${0x1B}OHDCP${this.delimiter}`)
    }
    /* STATUS **************************************************************************/
    returnStatus = () => {
        return this.status
    }
    /* PARSING *************************************************************************/
    parseResponse = (data) => {
        if(data.search('\r\n') > -1) {
            let response = data.substring(0,data.length -2)
            if(response.search('In') > -1) {
                this.status.input = Number(response.substring(3,2))
            } else if(response.search('Vmt') > -1) {
                this.status.videoMute = Number(response.substring(4,3))
            } else if(response.search('Ausw') > -1) {
                this.status.autoSwitchMode = Number(response.substring(4,5))
            } else if(response.search('Afmt') > -1) {
                this.status.audioMute = Number(response.substring(4,5))
            } else if(response.search('HDCP') > -1) {
                if(response.search('E') > -1) {
                    
                } else if(response.search('S')){

                }
            } else {
                if(this.lastCommand.search('HDCP') > -1) {
                    if(this.lastCommand.search('I') > -1) {
                        let inputIndex = Number(this.lastCommand.substring(3,4))
                        this.status.inputs[inputIndex - 1].hdcpStatus = Number(response.substring(0,1))
                    } else if(this.lastCommand.search('O') > -1) {
                        this.status.outputHdcp = Number(response.substring(0,1))
                    }
                }
            }
            return this.status
        }
    }
}