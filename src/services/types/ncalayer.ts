export type NcalayerResult = {
    code?: string;
    errorMessage?: string;
    responseObject?: string;
};

export class NCALayerError extends Error {
    code: string;
    constructor(message: string, code: string) {
        super(message);
        this.name = "NCALayerError";
        this.code = code;
        Object.setPrototypeOf(this, NCALayerError.prototype) // важно для instanceof
    }
}
