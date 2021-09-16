import React from 'react'
import ExtronSwHd4kPlusSeries from '../../control/ExtronSwHdPlusSeries'
import LgBasicControl from '../../control/LgBasicControl'
import ViscaOverIp from '../../control/ViscaOverIp'

const net = require('net')
const udp = require('dgram')

/* SWITCHER CONTROL **************************************************************************************************/
let switcher = new ExtronSwHd4kPlusSeries(2)
let switcherClient = {} 

/* DISPLAY CONTROL ***************************************************************************************************/
let displays = []
let displayClients = []
for(let displayIndex=0;displayIndex<4;displayIndex++) {
    displays.push(new LgBasicControl('01'))
    displayClients.push(net.connect({address: `192.168.1.4${displayIndex}`, port: 9761}, ()=> {console.log(`display ${displayIndex} connected`)}))
}

/* CAMERA CONTROL ****************************************************************************************************/
let cameras = []
let cameraClients = []
for(let cameraIndex=0;cameraIndex<2;cameraIndex++) {
    cameras.push(new ViscaOverIp(1,8,8,4))
    cameraClients.push(udp.createSocket('udp4'))
}
class App extends React.Component {
    state = {
        clientResponse: '',
        switcherStatus: {},
        displayStatus: [],
        cameraStatus: [],
        switcherClientStatus: '',
        clients: {
            switcher: {address: '127.0.0.1', port: 5001, status: '', socket: {}},
            displays: [
                {address: '127.0.0.1', port: 5101, status: '', socket: {}},
                {address: '127.0.0.1', port: 5102, status: '', socket: {}},
                {address: '127.0.0.1', port: 5103, status: '', socket: {}},
                {address: '127.0.0.1', port: 5104, status: '', socket: {}}
            ],
            cameras: [
                {address: '127.0.0.1', port: 5201, status: '', socket: {}},
                {address: '127.0.0.1', port: 5202, status: '', socket: {}}
            ]
        }
    }
    connectClient = (address,port,clientIndex) => {
        let clients = this.state.clients
        return net.connect({address: address, port: port}, ()=> {
            clients[clientIndex].status = 'connected'
            this.setState({clients})
        })
    }
    connectClients = () => {
        let clients = this.state.clients
        for(let clientIndex=0;clientIndex<clients.length;clientIndex++) {
            setTimeout(()=> clients[clientIndex].socket = this.connectClient(clients[clientIndex].address,clients[clientIndex].port,clientIndex,1000))
            setTimeout(()=> {
                if(this.state.clients[clientIndex].status !== 'connected') {
                    clients = this.state.clients
                    clients[clientIndex].status = 'not connected'
                    this.setState({clients})
                }
            },1100)
        }
        this.setState({clients})
    }
    initializeClients = () => {
        switcherClient.on('data', data => {this.setState({switcherStatus: switcher.parseResponse(data)})}) 
    }  
    sendSwitcherCommand = command => {
        switcherClient.write(command)
    }
    render() {
        console.log('clients = ',this.state.clients)
        return (
            <React.Fragment>
                <button>Please Press Me</button>
                <h5>{this.state.switcherStaus}</h5>
                <button onClick={()=> this.sendSwitcherCommand(switcher.setInputSelection(1))}>Switcher Input 1</button>
                <button onClick={()=> this.sendSwitcherCommand(switcher.setInputSelection(2))}>Switcher Input 2</button>
            </React.Fragment>
        )
    }
    componentDidMount() {
        this.connectClients()
        //this.initializeClients()
    }
}
export default App