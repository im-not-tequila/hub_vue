import { createCAdESFromBase64 } from '@/services/ncalayer.service'
import { type NcalayerResult } from '@/services/types/ncalayer'


async function fileToBase64(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            const result = reader.result;
            if (typeof result === 'string') {
                // FileReader уже вернет Base64, если использовать readAsDataURL
                const base64 = result.split(',')[1]; // убираем "data:*/*;base64,"
                resolve(base64);
            } else {
                reject(new Error('Ошибка при чтении файла'));
            }
        };

        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
    });
}

export async function signDocument(file: File): Promise<string> {
    const base64ToSign = await fileToBase64(file)

    const signedResult = await new Promise<NcalayerResult>((resolve, reject) => {
        createCAdESFromBase64('PKCS12', 'SIGNATURE', base64ToSign, false, (result: NcalayerResult) => {
            if (result.code !== '200') {
                reject(new Error(result.errorMessage || `NCALayer error: ${result.code}`))
            } else {
                resolve(result)
            }
        })
    })

    if (!signedResult.responseObject) {
        throw new Error('Signed result is missing from NCALayer')
    }

    return signedResult.responseObject
}
