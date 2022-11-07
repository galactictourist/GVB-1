import { Injectable } from '@nestjs/common';
import * as ethUtil from 'ethereumjs-util';

@Injectable()
export class SignatureVerifierService {
  verify(message: string, publicAddress: string, signature: string): boolean {
    try {
      // We now are in possession of msg, publicAddress and signature. We
      // can perform an elliptic curve signature verification with ecrecover
      const msgBuffer = Buffer.from(message);
      const msgHash = ethUtil.hashPersonalMessage(msgBuffer);
      const signatureParams = ethUtil.fromRpcSig(signature);
      const publicKey = ethUtil.ecrecover(
        msgHash,
        signatureParams.v,
        signatureParams.r,
        signatureParams.s,
      );
      const addressBuffer = ethUtil.publicToAddress(publicKey);
      const address = ethUtil.bufferToHex(addressBuffer);

      // The signature verification is successful if the address found with
      // ecrecover matches the initial publicAddress
      if (address.toLowerCase() === publicAddress.toLowerCase()) {
        return true;
      }
    } catch (e) {}
    return false;
  }
}
