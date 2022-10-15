import { start } from 'repl';
import { create, Message, Whatsapp } from 'venom-bot';
import { MessageHandlerUtils } from './messageHandler';

export class MessageSender {
    client!: Whatsapp;
    statusSession!: string;
    qrCode!: string
    messageHandler = new MessageHandlerUtils();

    constructor(sessionName: string) {
        this.init(sessionName);
    }

    private init(sessionName: string) {
        const venom = require('venom-bot');

        const start = (client: Whatsapp) => {
            this.client = client;
        }

        const qr = (base64QrImg: string) => {
            this.qrCode = base64QrImg;
        }

        const status = (statusSession: string) => {
            this.statusSession = statusSession;
        }

        venom.create({
            session: sessionName
        }, qr )
        .then(async (client: Whatsapp) => {
            start(client);
            client.onAnyMessage(async message => {
                console.log(message)
                this.handleMessage(message);
            })
        })
        .catch((error: string) => {
            console.error(error); 
        })        
    }   

    async sendText(to: string, text: string) {
       /* if(!to.includes("@c.us") && !to.includes("@g.us")) {
            to = to + "@c.us";
        }*//*
        await this.client.checkNumberStatus(to).then((status) => {
            console.log("chegueiaqui")
            console.log(status);
            console.log(to.substring(0, 12))
        }).catch((error: any) => {
            console.error(error)
        })*/
        this.client.sendText(to, text).then(() => {
            console.log("Final send text.. passing here then god's up")
        }).catch(error => {
            console.error(error)
        });
    }

    async getConnectionState() {
        return this.client.getConnectionState().then((state) => {
            this.statusSession = state;
            return this.statusSession;
        });
    }

    async handleMessage(message: Message) { 
            this.messageHandler.handleMessage(message).then(toSend => {
                console.log(toSend.message);
                this.sendText(toSend.to, toSend.message).then(() => {
                    console.log("Your message was successfully sent!")
                }).catch(error => {
                    console.error(error)
                })
                //this.sendText(toSend.to, toSend.message);
            }).catch(error => {
                console.error(error)
            })            
    }
   
}

module.exports.messageSender = MessageSender;



