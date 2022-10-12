import { Message } from "venom-bot";
import { MessageSender } from "./messageSender";

/**
 * Aqui vão os métodos relacionados com o tratamento de mensagens
 */
export class MessageHandlerUtils {
    contactsAllowedToAnswer: string[] = [];
    translateGroup = '120363026697593827@g.us'; // esse valor está errado!

    constructor() {
        this.contactsAllowedToAnswer.push("Mãe")

    }

    async handleMessage(message: Message) {
        var toReturn = {
            message: "",
            to: ""
        }

        if(!message.fromMe && this.contactsAllowedToAnswer.includes(message.chat.contact.name)) { // trava de segurança pra controlar quem é respondido :)
            var text = "Opa " + message.chat.contact.pushname + "!"
            + " Passando pra dizer que estou ocupado ou não consigo responder agora. Quem fala é o robô de resposta automática do Gustavo." 
            + " Isso aí, um robô. Mas fica tranquilo, assim que possível ele te retorna ;)"

            toReturn.message = text;
            toReturn.to = message.chatId;

        } else if (message.from = this.translateGroup) { 
            await this.translate(message.content).then(translated => {
                toReturn.to = this.translateGroup;
                toReturn.message = translated;
            }).catch(error => {
                console.error(error)
            })                                                  
        }
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