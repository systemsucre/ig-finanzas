// const URL = 'https://etvs.alwaysdata.net/server_chagas/'
const URL = 'https://ig-finanzas-bc.vercel.app/'

// const URL = 'http://localhost:3005/'
const LOCAL_URL = '/ig'


const TIEMPO_INACTIVO = 60 // MINUTOS DE TOLERANCIA ANTESDE QUE EL USUARIO VUELVA A INTERACTUAR CON EL SISTEMA YA SEA MEDIANTE MUOSE O TECLADO
const INPUT = {
    INPUT_BUSCAR: /^[()/a-zA-Z Ññ0-9_-]{1,400}$/,
    ESTABLECIMIENTO: /^[()/a-zA-Z Ññ0-9_-aáeéiíoóuúAÁEÉIÍOÓUÚ]{1,400}$/,
    NIT: /^[()/a-zA-Z Ññ0-9_-]{6,20}$/,
    INPUT_USUARIO: /^[a-zA-ZÑñ0-9]{4,16}$/, // Letras, numeros, guion y guion_bajo
    PASSWORD: /^.{4,12}$/, // 4 a 12 digitos.
    NOMBRE_PERSONA: /^[a-zA-ZÑñaáeéiíoóuúAÁEÉIÍOÓUÚ ]{2,50}$/,
    // CI: /^\d{7,10}$/,
    CI: /^\d{5,15}((\s|[-])\d{1}[A-Z]{1})?$/,
    DIRECCION: /^[a-zA-ZÑñ /0-9-@.,+]{1,100}$/,
    TELEFONO: /^[+0-9 ]{2,18}$/, // /^\d{5,15}$/, // 7 a 10 numeros.
    CUENTA: /^\d{5,30}$/, // 7 a 10 numeros.
    ID: /^\d{1,10}$/, // id de redes, 1 a 4 digitos
    CODIGO_TRAMITE:/^[A-Z]{3}-\d{8}$/,
    FECHA: /\d{4}[-]\d{2}[-]\d{2}/,
    MES: /\d{4}[-]\d{2}/,
    HORA: /\d{2}[:]\d{2}/,
    SEXO: /^[FMfm]{1}$/,
    SEXO3: /^[FMfmTt]{1}$/,
    NHC: /^\d{1,10}$/,
    CODIGO_ENTIDAD: /^[A-Z Ññ0-9_-]{1,5}$/,
    EDAD: /^\d{1,3}$/, // id de redes, 1 a 4 digitos  
    TEXT: /^.{1,500}$/,  
    NUMSIMSIGNO: /^\d{1,15}((\s|[.])\d{1,2})?$/,  
    NUMERO_REALES_POSITIVOS: /^\d*(\.\d)?$/, 
    NUMEROS: /^-?\d+([.]\d+)?(?:[Ee][-+]?\d+)?$/, // /^[0-9]+([.][0-9]+)?$/,  //NUMEROS ENTEROS MAS NUMEROS REALES, negativos, mas notacion cientifica (ej: 1.2e+05)   /^-?\d+([.]\d+)?(?:[Ee][-+]?\d+)?$/ 
    COORDENADAS: /^-?\d+([.]\d+)?(?:[Ee][-+]?\d+)?$/,   // /^[0-9]+([.][0-9]+)?$/,  //NUMEROS ENTEROS MAS NUMEROS REALES, negativos, mas notacion cientifica (ej: 1.2e+05)   /^-?\d+([.]\d+)?(?:[Ee][-+]?\d+)?$/ 
    NUMEROS_PN: /^-?\d*(\.\d+)?$/,   // /^[0-9]+([.][0-9]+)?$/,  //NUMEROS ENTEROS MAS NUMEROS REALES, negativos, mas notacion cientifica (ej: 1.2e+05)   /^-?\d+([.]\d+)?(?:[Ee][-+]?\d+)?$/ 
    NUMEROS_P: /^[0-9]{1,20}$/,   // números enteros positivos 
    NUMEROS_MONEY: /^[0-9]{1,10}(\.[0-9]{1,2})?$/,   // MONEY
    CORREO: /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/,
    IMG: /.jpg|.jpeg|.png/i,
    PDF: /.pdf/i,
}
export {
    // URL, LOCAL_URL, INPUT, TIEMPO_INACTIVO
    URL, INPUT, TIEMPO_INACTIVO, LOCAL_URL
}
