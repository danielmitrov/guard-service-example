import {Request, Response, NextFunction} from 'express';

import {authBaseAPI, appName} from '../consts';


function getCurrentUrl(req) {
    return req.protocol + '://' + req.get('host') + req.originalUrl;
}

async function handleUnauthenticated(req: Request, res: Response) {
    const currentUrl = getCurrentUrl(req);
    const redirectUrl = new URL(authBaseAPI);
    
    redirectUrl.searchParams.set('appName', appName);
    redirectUrl.searchParams.set('continue', encodeURIComponent(currentUrl));
    res.redirect(redirectUrl.href);
}

async function authenticate(req: Request, res: Response, next: NextFunction) {
    handleUnauthenticated(req, res);
}

export default authenticate;
