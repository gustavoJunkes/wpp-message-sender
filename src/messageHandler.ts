import { Message } from "venom-bot";
import { MessageSender } from "./messageSender";

/**
 * Aqui vão os métodos relacionados com o tratamento de mensagens
 */
export class MessageHandlerUtils {
    contactsAllowedToAnswer: string[] = [];
    translateGroup = '120363026697593827@g.us'; // esse valor está errado!
    translateNumbers: string[] = [];

    constructor() {
        //this.contactsAllowedToAnswer.push("Mãe")

    }

    async handleMessage(message: Message) {
        var toReturn = {
            message: "",
            to: ""
        }

        if(message.content === "Translate" && !message.fromMe) { // trava de segurança pra controlar quem é respondido :)
           console.log("1")
            var text = "Opa " + message.chat.contact.pushname + "!"
            + " Ativado o modo de tradução para você. Para desativar envie a seguinte mensagem: stop translate"
            
            this.translateNumbers.push(message.sender.id);

            toReturn.message = text;
            toReturn.to = message.chatId;

        } else if (message.content == "stop translate" && !message.fromMe) {
            console.log("2")

            this.translateNumbers.filter(number => {
                number !== message.sender.id
            })

        } else if (message.from == this.translateGroup || this.translateNumbers.includes(message.sender.id) &&  !message.fromMe) { 
            console.log("3")

            console.log(message)
            await this.translate(message.content).then(translated => {
                toReturn.to = message.sender.id;
                toReturn.message = translated;
            }).catch(error => {
                console.error(error)
            })                                                  
        } 
        console.log("4")
        console.log(toReturn.message)
        return toReturn;
    }

    async translate(text: string): Promise<string> {
        const { translate } = require('free-translate');

        return await translate(text, {from: 'pt', to: 'en'}).then((message: string) => {
            return message;
        }).catch((error: any) => {
            console.error(error);
        })

    }

}

module.exports.messageHandlerUtils = MessageHandlerUtils;