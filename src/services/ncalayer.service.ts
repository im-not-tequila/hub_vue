import { NcalayerResult } from './types/ncalayer'


const webSocket = new WebSocket('wss://127.0.0.1:13579/');
let callback: ((result: NcalayerResult) => void) | null = null;

webSocket.onopen = () => {
    console.log('NCALayer WebSocket подключен');
};

webSocket.onerror = (error) => {
    console.error('NCALayer WebSocket ошибка:', error);
};

webSocket.onmessage = (event: MessageEvent<string>) => {
    console.log('NCALayer ответ:', event.data);

    if (callback) {
        try {
            const data: NcalayerResult = JSON.parse(event.data);
            callback(data);
        } catch (err) {
            callback({
                errorCode: -1,
                errorMessage: 'Ошибка парсинга данных'
            });
        } finally {
            callback = null;
        }
    }
};

export function createCAdESFromBase64(
    storageName: string,
    keyType: string,
    base64ToSign: string,
    flag: boolean,
    cb: (result: NcalayerResult) => void
) {
    callback = cb;

    const message = {
        module: "kz.gov.pki.knca.commonUtils",
        method: "createCAdESFromBase64",
        args: [storageName, keyType, base64ToSign, flag]
    };

    webSocket.send(JSON.stringify(message));
}
