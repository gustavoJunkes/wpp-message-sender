import express, {Request, Response} from "express"
import { sensitiveHeaders } from "http2";
import { start } from 'repl';
import { create, Whatsapp } from 'venom-bot';
import { MessageSender } from "./messageSender";

const messageSender = new MessageSender("primary/messageSender-session");

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended:false }))
app.listen(8080);

// todo: implementar chamada api get para status da conexão (retorna o qr code se estiver desconectado)
app.get("/connectionStatus", (request: Request, response: Response) => {
        messageSender.getConnectionState().then((state) => {
           return response.status(200).json(state)
        });
    
})

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

