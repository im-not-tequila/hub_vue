import { NcalayerResult } from './types/ncalayer'

export function createCAdESFromBase64(
    storageName: string,
    keyType: string,
    base64ToSign: string,
    flag: boolean,
    cb: (result: NcalayerResult) => void
) {
    let callback: ((result: NcalayerResult) => void) | null = cb;
    let webSocket: WebSocket | null = null;

    const safeCallback = (result: NcalayerResult) => {
        if (callback) {
            callback(result);
            callback = null; // гарантируем единоразовый вызов
            if (webSocket) {
                webSocket.close();
            }
        }
    };

    try {
        webSocket = new WebSocket('wss://127.0.0.1:13579/');
    } catch (error: any) {
        safeCallback({
            code: '-1',
            errorMessage: error?.toString() || 'Ошибка инициализации WebSocket'
        });
        return;
    }

    webSocket.onopen = () => {
        try {
            const message = {
                module: "kz.gov.pki.knca.commonUtils",
                method: "createCAdESFromBase64",
                args: [storageName, keyType, base64ToSign, flag]
            };

            webSocket?.send(JSON.stringify(message));
        } catch (error: any) {
            safeCallback({
                code: '-1',
                errorMessage: error?.toString() || 'Ошибка при отправке данных в NCALayer'
            });
        }
    };

    webSocket.onerror = (event: Event) => {
        safeCallback({
            code: '-1',
            errorMessage: `Ошибка WebSocket: ${String(event)}`
        });
    };

    webSocket.onmessage = (event: MessageEvent<string>) => {
        try {
            const data: NcalayerResult = JSON.parse(event.data);
            console.log(event.data);

            // проверяем: это финальный ответ (с подписью или ошибкой)
            if (data.code || data.responseObject) {
                safeCallback(data);
            } else {
                if (data.code === '500'){
                    safeCallback(data)
                }

            }
        } catch {
            safeCallback({
                code: '-2',
                errorMessage: 'Ошибка парсинга ответа NCALayer'
            });
        }
    };

    webSocket.onclose = (event) => {
        if (callback) {
            safeCallback({
                code: '-3',
                errorMessage: `Соединение закрыто (код=${event.code})`
            });
        }
    };
}
