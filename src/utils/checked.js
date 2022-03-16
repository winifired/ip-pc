export function phone(number) {
    let reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
    let regEmail = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
    if (!number) {
        return false;
    } else if (number.indexOf('@') != -1) {
        if (!regEmail.test(number)) {
            return false;
        } else {
            return true;
        }
    } else {
        if (!reg.test(number)) {
            return false;
        } else {
            return true;
        }
    }
}