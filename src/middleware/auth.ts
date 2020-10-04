import {Request, Response, NextFunction} from 'express';

import {authBaseAPI, appName} from '../consts';
import {validateGuardToken} from '../utils/validateGuardToken';
import {createToken, validateToken} from '../utils/serviceToken';


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

async function validateSitesToken(req: Request, res: Response, next: NextFunction) {
    try {
        const {username} = await validateToken(req.cookies.token);
        req.username = username;
        next();
    } catch {
        const currentUrl = getCurrentUrl(req);

        res.cookie('token', '', {maxAge: 0});
        res.redirect(currentUrl);
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
    } else if (req.cookies.token) {
        validateSitesToken(req, res, next);
    } else {
        handleUnauthenticated(req, res);
    }
}

export default authenticate;
