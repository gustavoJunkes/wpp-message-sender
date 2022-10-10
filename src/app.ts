import express, {Request, Response} from "express"
import { sensitiveHeaders } from "http2";
import { start } from 'repl';
import { create, Whatsapp } from 'venom-bot';


// todo: extrair classe para outro arquivo
class MessageSender {
    client!: Whatsapp;
    statusSession!: string;
    qrCode!: string

    constructor() {
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
        .then((client: Whatsapp) => start(client))
        .catch((error: string) => {
            console.error(error)
        })
    }   

    async sendText(to: string, text: string) {
        if(!to.includes("@c.us")) {
            to = to + "@c.us";
        }
        this.client.sendText(to, text);
    }
}


const messageSender = new MessageSender();

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended:false }))
app.listen(8080);

// todo: implementar chamada api get para status da conexão (retorna o qr code se estiver desconectado)
app.get("/connectionStatus", (request: Request, response: Response) => {
    
})
// todo: implementar chamada api para enviar mensagem

 app.post("/sendMessage", async (request: Request, response: Response) => {
    const {phone, message}  = request.body;
    
    try {
        await messageSender.sendText(phone, message);
    } catch (error: any) {
        console.error(error);
        return response.status(500).json({status: "error", message: "An error occured while sending the message."});
    } 
    return response.status(200).json({message: "The given message was successfully sent."}); 
})
