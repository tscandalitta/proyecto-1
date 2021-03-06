var iconoPasswordOculta = "far fa-eye-slash pwd-icon";
var iconoPasswordVisible = "far fa-eye pwd-icon";

var puntaje = 0;
var longitud = new ParametroLongitud("longitud", "Longitud", 0);
var cantMayusculas = new ParametroEntero("cantMayusculas", "Letras mayúsculas", 0);
var cantMinusculas = new ParametroEntero("cantMinusculas", "Letras minúsculas", 0);
var cantNumeros = new ParametroEntero("cantNumeros", "Números", 0);
var cantSimbolos = new ParametroEntero("cantSimbolos", "Símbolos", 0);
var soloLetras = new ParametroBooleano("soloLetras", "Solo letras", false);
var soloNumeros = new ParametroBooleano("soloNumeros", "Solo números", false);
var tieneSecuenciaLetras = new ParametroBooleano("tieneSecuenciaLetras", "Secuencia de letras", false);
var tieneSecuenciaNumeros = new ParametroBooleano("tieneSecuenciaNumeros", "Secuencia de números", false);
var tieneSecuenciaSimbolos = new ParametroBooleano("tieneSecuenciaSimbolos", "Secuencia de símbolos", false);

var parametrosAFavor = [
    longitud, cantMayusculas, cantMinusculas, cantNumeros, cantSimbolos
];

var parametrosEnContra = [
    soloLetras, soloNumeros, tieneSecuenciaLetras, tieneSecuenciaNumeros,
    tieneSecuenciaSimbolos
];

document.getElementById("password-input").addEventListener("input", checkPassword);

$("#password-button").click(function () {
    almacenarPassword();
    actualizarTablaPasswords();
});

$("#password-icon").click(function () {
    togglePassword();
});

init();

function almacenarPassword() {
    let password = $("#password-input").val();
    if (password != "") {
        let pwd = {
            password,
            puntaje
        }
        storePassword(pwd);
    }
}

function togglePassword() {
    var password = document.getElementById("password-input");
    var icon = document.getElementById("password-icon");
    if (password.type == "password") {
        password.type = "text";
        icon.className = iconoPasswordOculta;
        icon.setAttribute("title", "Ocultar contraseña");
    } else {
        password.type = "password";
        icon.className = iconoPasswordVisible;
        icon.setAttribute("title", "Mostrar contraseña");
    }
}

function completarTablas() {
    var tablaPuntosFavorBody = document.getElementById("tabla-puntos-favor-body");
    var tablaPuntosContraBody = document.getElementById("tabla-puntos-contra-body");
    completarTabla(parametrosAFavor, tablaPuntosFavorBody);
    completarTabla(parametrosEnContra, tablaPuntosContraBody);

}

function actualizarTablas() {
    actualizarValores(parametrosAFavor);
    actualizarValores(parametrosEnContra);
}

function checkPassword() {
    var password = $("#password-input").val();
    chkPass(password);
    mostrarResultado(password, puntaje);
    actualizarTablas();
}

function init() {
    actualizarTablaPasswords();
    completarTablas();
}


/******************************* CHECK PASSWORD ******************************/
String.prototype.strReverse = function () {
    var newstring = "";
    for (var s = 0; s < this.length; s++) {
        newstring = this.charAt(s) + newstring;
    }
    return newstring;
}

function chkPass(pwd) {

    var puntajeP = 0,
        longitudP = 0,
        cantMayusculasP = 0,
        cantMinusculasP = 0,
        cantNumerosP = 0,
        cantSimbolosP = 0;
    var soloLetrasP = false,
        soloNumerosP = false,
        secuenciaSimbolosP = false,
        secuenciaLetrasP = false,
        secuenciaNumerosP = false;

    if (pwd != "") {
        var nConsecAlpha = 0,
            nConsecNumber = 0,
            nConsecSymbol = 0,
            nSeqAlpha = 0,
            nSeqNumber = 0,
            nSeqSymbol = 0;
        var nMultConsecChar = 2;
        var nMultSeqAlpha = 3,
            nMultSeqNumber = 3,
            nMultSeqSymbol = 3;
        var nMultLength = 4,
            nMultNumber = 4;
        var nMultSymbol = 6;

        var secuenciaLetras = "abcdefghijklmnopqrstuvwxyz";
        var secuenciaNumeros = "01234567890";
        var secuenciaSimbolos = ")!@#$%^&*()";

        longitudP = pwd.length;
        puntajeP = longitudP * nMultLength;
        var arrPwd = pwd.replace(/\s+/g, "").split(/\s*/);
        var arrPwdLen = arrPwd.length;

        /* Loop sobre la contraseña para buscar coincidencias de minúsculas, mayúsculas, numeros y simbolos */
        var nTmpAlphaUC = "",
            nTmpAlphaLC = "",
            nTmpNumber = "",
            nTmpSymbol = "";
        for (var a = 0; a < arrPwdLen; a++) {
            if (arrPwd[a].match(/[A-Z]/g)) {
                if (nTmpAlphaUC !== "") {
                    if ((nTmpAlphaUC + 1) == a) {
                        nConsecAlpha++;
                    }
                }
                nTmpAlphaUC = a;
                cantMayusculasP++;
            } else if (arrPwd[a].match(/[a-z]/g)) {
                if (nTmpAlphaLC !== "") {
                    if ((nTmpAlphaLC + 1) == a) {
                        nConsecAlpha++;
                    }
                }
                nTmpAlphaLC = a;
                cantMinusculasP++;
            } else if (arrPwd[a].match(/[0-9]/g)) {
                if (nTmpNumber !== "") {
                    if ((nTmpNumber + 1) == a) {
                        nConsecNumber++;
                    }
                }
                nTmpNumber = a;
                cantNumerosP++;
            } else if (arrPwd[a].match(/[^a-zA-Z0-9_]/g)) {
                if (nTmpSymbol !== "") {
                    if ((nTmpSymbol + 1) == a) {
                        nConsecSymbol++;
                    }
                }
                nTmpSymbol = a;
                cantSimbolosP++;
            }
        }

        /* Busca secuencias de letras (hacia adelante y hacia atras) */
        var pwdLowerCase = pwd.toLowerCase();
        for (var s = 0; s < 23; s++) {
            var sFwd = secuenciaLetras.substring(s, s + 3);
            var sRev = sFwd.strReverse();
            if (pwdLowerCase.indexOf(sFwd) != -1 || pwdLowerCase.indexOf(sRev) != -1) {
                nSeqAlpha++;
            }
        }
        /* Busca secuencias de numeros (hacia adelante y hacia atras) */
        for (var s = 0; s < 8; s++) {
            var sFwd = secuenciaNumeros.substring(s, s + 3);
            var sRev = sFwd.strReverse();
            if (pwd.indexOf(sFwd) != -1 || pwd.indexOf(sRev) != -1) {
                nSeqNumber++;
            }
        }
        /* Busca secuencias de simbolos (hacia adelante y hacia atras) */
        for (var s = 0; s < 8; s++) {
            var sFwd = secuenciaSimbolos.substring(s, s + 3);
            var sRev = sFwd.strReverse();
            if (pwd.indexOf(sFwd) != -1 || pwd.indexOf(sRev) != -1) {
                nSeqSymbol++;
            }
        }

        /* Asignacion de puntajes */
        if (cantMayusculasP > 0 && cantMayusculasP < longitudP) {
            puntajeP += ((longitudP - cantMayusculasP) * 2);
        }
        if (cantMinusculasP > 0 && cantMinusculasP < longitudP) {
            puntajeP += ((longitudP - cantMinusculasP) * 2);
        }
        if (cantNumerosP > 0 && cantNumerosP < longitudP) {
            puntajeP += (cantNumerosP * nMultNumber);
        }
        if (cantSimbolosP > 0) {
            puntajeP += (cantSimbolosP * nMultSymbol);
        }

        /* Reduccion de puntaje debido a malas practicas */
        if ((cantMinusculasP > 0 || cantMayusculasP > 0) && cantSimbolosP === 0 && cantNumerosP === 0) { // Solo letras
            puntajeP -= longitudP;
            soloLetrasP = true;
        }
        if (cantMinusculasP === 0 && cantMayusculasP === 0 && cantSimbolosP === 0 && cantNumerosP > 0) { // Solo numeros
            puntajeP -= longitudP;
            soloNumerosP = true;
        }

        puntajeP -= (nConsecAlpha + nConsecNumber + nConsecSymbol) * nMultConsecChar; // Hay caracteres consecutivos

        if (nSeqAlpha > 0) { // Existen secuencias de letras (3 caracteres o mas)
            puntajeP -= (nSeqAlpha * nMultSeqAlpha);
            secuenciaLetrasP = true;
        }
        if (nSeqNumber > 0) { // Existen secuencias de numeros (3 caracteres o mas)
            puntajeP -= (nSeqNumber * nMultSeqNumber);
            secuenciaNumerosP = true;
        }
        if (nSeqSymbol > 0) { // Existen secuencias de simbolos (3 caracteres o mas)
            puntajeP -= (nSeqSymbol * nMultSeqSymbol);
            secuenciaSimbolosP = true;
        }

        if (puntajeP > 100)
            puntajeP = 100;
        else if (puntajeP < 0)
            puntajeP = 0;
    }

    puntaje = puntajeP;
    longitud.valor = longitudP;
    cantMayusculas.valor = cantMayusculasP;
    cantMinusculas.valor = cantMinusculasP;
    cantNumeros.valor = cantNumerosP;
    cantSimbolos.valor = cantSimbolosP;
    soloLetras.valor = soloLetrasP;
    soloNumeros.valor = soloNumerosP;
    tieneSecuenciaSimbolos.valor = secuenciaSimbolosP;
    tieneSecuenciaLetras.valor = secuenciaLetrasP;
    tieneSecuenciaNumeros.valor = secuenciaNumerosP;
}