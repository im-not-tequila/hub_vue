import * as authApi from '../api/auth.api'

import { createCAdESFromBase64 } from '@/services/ncalayer.service'
import { type NcalayerResult } from '@/services/types/ncalayer'


export const ecpLogin = async () =>{
    const ncalayerChallengeResponse = await authApi.ncalayerChallenge()
    const base64ToSign = ncalayerChallengeResponse.data.challenge

    const signedResult = await new Promise<NcalayerResult>((resolve, reject) => {
        createCAdESFromBase64('PKCS12', 'AUTH', base64ToSign, true, (result: NcalayerResult) => {
            if (result.errorCode) {
                reject(new Error(result.errorMessage || `NCALayer error: ${result.errorCode}`))
            } else {
                resolve(result)
            }
        })
    })

    if (!signedResult.responseObject) {
        throw new Error('Signed result is missing from NCALayer')
    }

    return await authApi.ncalayerVerify({
        signed_data: signedResult.responseObject,
        original_data: base64ToSign
    })
}
