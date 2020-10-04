import jwt from 'jsonwebtoken';

import {sitesSecret} from '../consts';

export function createToken({username}: {username: string}): string {
    return jwt.sign({username}, sitesSecret);
}
