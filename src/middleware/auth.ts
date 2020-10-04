import {Request, Response, NextFunction} from 'express';

import {authBaseAPI, appName} from '../consts';
import {validateGuardToken} from '../utils/validateGuardToken';
import {createToken} from '../utils/serviceToken';


function getCurrentUrl(req) {
    return req.protocol + '://' + req.get('host') + req.originalUrl;
}

async function handleGuardToken(req: Request, res: Response) {
    try {
        const payload = await validateGuardToken(req.query.token);

        const redirectUrl = new URL(getCurrentUrl(req));
        redirectUrl.searchParams.delete('token');

        res.cookie('token', createToken(payload));
        res.redirect(redirectUrl.href);
    } catch(e) {
        return res.status(401).send({error: 'invalid token'});
    }
}

async function handleUnauthenticated(req: Request, res: Response) {
    const currentUrl = getCurrentUrl(req);
    const redirectUrl = new URL(authBaseAPI);
    
    redirectUrl.searchParams.set('appName', appName);
    redirectUrl.searchParams.set('continue', encodeURIComponent(currentUrl));
    res.redirect(redirectUrl.href);
}

async function authenticate(req: Request, res: Response, next: NextFunction) {
    if (req.query.token) {
        handleGuardToken(req, res);
    } else {
        handleUnauthenticated(req, res);
    }
}

export default authenticate;
