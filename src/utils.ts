export class Utils {

    valueInIgnoreCase (str1: string, str2: string): boolean {
        var toReturn = false;

        str1.localeCompare(str2, undefined, {sensitivity: 'accent'})
    }
}
global.exports.utils = Utils