import { Message } from "venom-bot";
import { MessageSender } from "./messageSender";
import { Utils } from "./utils";

/**
 * Aqui vão os métodos relacionados com o tratamento de mensagens
 */
export class MessageHandlerUtils {
    contactsAllowedToAnswer: string[] = [];
    translateGroup = '120363026697593827@g.us'; // esse valor está errado!
    translateNumbers: string[] = [];
    utils = new Utils();

    constructor() {
        //this.contactsAllowedToAnswer.push("Mãe")

    }

    async handleMessage(message: Message) {
        var toReturn = {
            message: "",
            to: ""
        }
        if((message.content === "Translate"  || this.utils.valueInIgnoreCase("translate", message.content)) && !this.utils.valueInIgnoreCase("stop", message.content) && !message.fromMe) { // trava de segurança pra controlar quem é respondido :)
            var text = "Olá " + message.chat.contact.pushname + "!"
            + " Ativado o modo de tradução para você. A partir de agora, todas as suas mensagens serão traduzidas. Para desativar envie a seguinte mensagem: stop translate"
            
            this.translateNumbers.push(message.sender.id);

            toReturn.message = text;
            toReturn.to = message.chatId;

        } else if (this.utils.valueInIgnoreCase("stop translate", message.content) && !message.fromMe) {
            this.translateNumbers.filter(number => {
                number !== message.sender.id
            })
            toReturn.message = "Ok, a partir de agora suas mensagens não serão mais traduzidas."
            toReturn.to = message.from;
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