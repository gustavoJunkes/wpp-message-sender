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
            var text = "Opa " + message.chat.contact.pushname + "!"
            + " Ativado o modo de tradução para você. Para desativar envie a seguinte mensagem: stop translate"
            
            this.translateNumbers.push(message.sender.id);

            toReturn.message = text;
            toReturn.to = message.chatId;

        } else if (message.content == "stop translate" && !message.fromMe) {
            this.translateNumbers.filter(number => {
                number !== message.sender.id
            })

        } else if (message.from == this.translateGroup || this.translateNumbers.includes(message.sender.id) &&  !message.fromMe) { 
            console.log(message)
            await this.translate(message.content).then(translated => {
                toReturn.to = message.sender.id;
                toReturn.message = translated;
            }).catch(error => {
                console.error(error)
            })                                                  
        } 
        console.log(toReturn.message)
        return toReturn;
    }
    // verificar qual a lingua, se a msg for em ingles traduzir para português, se for em pt traduz pra ingles
    // traduzir pro ing e pro port, se o resultado for diferente do texto inicial, retorna esse
    async translate(textToTranslate: string): Promise<string> {
        const { translate } = require('free-translate');

        var textPt = await translate(textToTranslate, {to: 'pt'}).then((message: string) => {
            return message;
        }).catch((error: any) => {
            console.error(error);
        })

        if (textPt != textToTranslate) {
            return textPt;
        } else {
            var textEng = await translate(textToTranslate, {to: 'en'}).then((message: string) => {
                return message;
            }).catch((error: any) => {
                console.error(error);
            })
            return textEng;
        }

        

    }

}

module.exports.messageHandlerUtils = MessageHandlerUtils;