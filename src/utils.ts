export class Utils {

    valueInIgnoreCase (str1: string, str2: string): boolean {
        if (str1 === str2) {
            return true;
        }    
        // colocar uppercase e verificar se 2 esta em 1
        str1 = str1.toLocaleLowerCase();
        str2 = str2.toLocaleLowerCase();

        if(str1 == str2) {
            return true
        }

        if (str1.includes(str2)) {
            return true;
        }
        return false;
    }
}
global.exports.utils = Utils