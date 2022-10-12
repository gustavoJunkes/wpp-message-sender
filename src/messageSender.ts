import { start } from 'repl';
import { create, Message, Whatsapp } from 'venom-bot';

export class MessageSender {
    client!: Whatsapp;
    statusSession!: string;
    qrCode!: string
    contactsAllowedToAnswer: string[] = [];

    constructor() {
        this.contactsAllowedToAnswer.push("Mãe")
        this.init();
    }

    private init() {
        const venom = require('venom-bot');

        const start = (client: Whatsapp) => {
            this.client = client;
          //  this.sendText("554788591737", "Olá"); // todo: receber numero e mensagem por parametro
        }

        const qr = (base64QrImg: string) => {
            this.qrCode = base64QrImg;
        }

        const status = (statusSession: string) => {
            this.statusSession = statusSession;
        }

        venom.create({
            session: 'main-session'
        }, qr )
        .then(async (client: Whatsapp) => {
            start(client);
            client.onMessage(async message => {
                console.log(message)
                this.handleMessage(message);
            })
        })
        .catch((error: string) => {
            console.error(error); 
        })        
    }   

    async sendText(to: string, text: string) {
        if(!to.includes("@c.us")) {
            to = to + "@c.us";
        }
        this.client.sendText(to, text);
    }

    async getConnectionState() {
        return this.client.getConnectionState().then((state) => {
            this.statusSession = state;
            return this.statusSession;
        });
    }

    async handleMessage(message: Message) {
        if(this.contactsAllowedToAnswer.includes(message.chat.contact.name)) { // trava de segurança pra controlar quem é respondido :)
            var text = "Olá " + message.chat.contact.pushname + "!"
            + " Passando pra dizer que estou ocupado ou não consigo responder agora. Quem fala é o robô de resposta automática do Gustavo." 
            + " Isso aí, um robô. Mas fica tranquilo, assim que possível ele te retorna ;)"

            this.sendText(message.chatId, text);
        }
    }
   
}

module.exports.messageSender = MessageSender;



