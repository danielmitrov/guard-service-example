import jwt from 'jsonwebtoken';

import {sitesSecret} from '../consts';

export function createToken({username}: {username: string}): string {
    return jwt.sign({username}, sitesSecret);
}

export function validateToken(token): Promise<{username: string}> {
    return new Promise((resolve, reject) => {
        jwt.verify(token, sitesSecret, function(err, decoded) {
            if (err) {
                return reject(err);
            }
    
            resolve(decoded);
        });
    });
}
