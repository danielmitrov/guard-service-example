import jwksClient from 'jwks-rsa';
import jwt from 'jsonwebtoken';

import {keysUrl} from '../consts';


const client = jwksClient({
    strictSsl: true,
    jwksUri: keysUrl,
});


export function validateGuardToken(token): Promise<{username: string}> {
    return new Promise((resolve, reject) => {
        const decodedToken = jwt.decode(token, {complete: true}) as {header: {kid: string}};

        const kid = decodedToken?.header?.kid;
        if (!kid) {
            reject();
        }
        client.getSigningKey(kid, (err, key) => {
            if (err) {
                return reject(err);
            }

            const signingKey = key.getPublicKey();

            jwt.verify(token, signingKey, function(err, decoded) {
                if (err) {
                    return reject(err);
                }

                resolve(decoded);
            });
        });
    });
}
