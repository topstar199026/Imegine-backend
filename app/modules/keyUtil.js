// https://github.com/rzcoder/node-rsa
// https://nodejs.org/api/crypto.html#crypto_crypto_generatekeypair_type_options_callback

const fs = require('fs');
const crypto = require("crypto");
var aes256 = require('aes256');
var AES = require("crypto-js/aes");
var CryptoJS = require("crypto-js");

let serverPublicKey = '', serverPrivateKey = '';

const generateServerKey = async () => {
    if (fs.existsSync('keys/public.pem') && fs.existsSync('keys/private.pem')) {
    } else {
        const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
            modulusLength: 2048,
            publicKeyEncoding: {
                // type: 'spki',
                type: 'pkcs1',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
            }
        });

        fs.openSync('keys/public.pem', 'w');
        fs.writeFileSync('keys/public.pem', publicKey, 'utf8');
        fs.openSync('keys/private.pem', 'w');
        fs.writeFileSync('keys/private.pem', privateKey, 'utf8');

    }

    const _privateKey = fs.readFileSync('keys/private.pem', 'utf8');
    const _publicKey = fs.readFileSync('keys/public.pem', 'utf8');

    serverPublicKey = _publicKey;
    serverPrivateKey = _privateKey;
}

const getServerPublicKey = () => {
    return serverPublicKey;
}

const getServerPrivateKey = () => {
    return serverPrivateKey;
}

const serverDecrypt = (_data) => {
    const decryptedData = crypto.privateDecrypt(
        {
          key: getServerPrivateKey(),
          padding: crypto.constants.RSA_PKCS1_PADDING,
        },
        Buffer.from(_data, "base64")
    );
    return decryptedData.toString("utf8");

}

const serverEncrypt = (_data) => {
    const encryptedData = crypto.publicEncrypt(
        {
          key: getServerPublicKey(),
          padding: crypto.constants.RSA_PKCS1_PADDING,//RSA_PKCS1_OAEP_PADDING,
        },
        Buffer.from(_data, 'utf8')
    );
    return encryptedData.toString("utf8");
}

const encrypt = (_data, publicKey) => {
    const encryptedData = crypto.publicEncrypt(
        {
          key: publicKey,
          padding: crypto.constants.RSA_PKCS1_PADDING,//RSA_PKCS1_OAEP_PADDING,
        },
        Buffer.from(_data, 'utf8')
    );

    return encryptedData.toString('base64');
}

const decrypt = (_data, privateKey) => {
    const decryptedData = crypto.privateDecrypt(
        {
          key: privateKey,
          padding: crypto.constants.RSA_PKCS1_PADDING,
        },
        Buffer.from(_data, "base64")
    );
    return decryptedData.toString("utf8")
}

function generateRandomAesKey() {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*-_=+|:<>?/,.';
    var charactersLength = characters.length;
    for ( var i = 0; i < 214; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * 
        charactersLength));
    }
    return result;
}

const aesEncrypt1 = (_data, key) => {
    return aes256.encrypt(key, _data);
}

const aesDecrypt1 = (_data, key) => {
    return aes256.decrypt(key, _data);
}

const aesEncrypt0 = async (_data, key) => {
    let _key = generateRandomAesKey();
    let res = await AES.encrypt(_data, _key).toString();
    return {
        key: _key,
        data: res,
    };
}

const aesDecrypt0 = async (_data, _key) => {
    let bytes  = await AES.decrypt(_data, _key);
    let res = bytes.toString(CryptoJS.enc.Utf8);
    return res;
}

const objectEncrypt = async (object, sec) => {
    for (const [key, value] of Object.entries(object)) {
        console.log(key, value);
        if(key !== 'key') object[key] = await encrypt(value, sec);
    }
    return object;
}

const objectDecrypt = (object, sec) => {
    for (const [key, value] of Object.entries(object)) {
        if(key !== 'key') object[key] = decrypt(value, sec);
    }
    return object;
}

const rsaAesDecrypt = async (_data) => {
    var _key = _data.key;
    _key = serverDecrypt(_key);
    var data = await aesDecrypt0(_data.data, _key);
    data =  JSON.parse(data);
    return data;
}

const rsaAesDecryptWithKey = async (_data) => {
    var _key = _data.key;
    _key = serverDecrypt(_key);
    var data = await aesDecrypt0(_data.data, _key);
    data =  JSON.parse(data);
    
    var res = {
        key: null,
        dataDec: null,
        dataEnc: null,
    };

    res.dataDec = data;
    res.dataEnc = _data.data;
    res.key = _key;
    return res;
}

module.exports = {
	generateServerKey,
    getServerPublicKey,
    getServerPrivateKey,
    serverDecrypt,
    serverEncrypt,
    encrypt,
    decrypt,
    aesEncrypt0,
    aesDecrypt0,
    aesEncrypt1,
    aesDecrypt1,
    objectEncrypt,
    objectDecrypt,
    rsaAesDecrypt,
    rsaAesDecryptWithKey,
}