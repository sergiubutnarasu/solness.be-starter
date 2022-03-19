import { Request } from 'express';
import {
  AppConfigKey,
  AppHelper,
  DateHelper,
  Environment,
} from '~/core';
import { TokenPayload } from '../objects';

class AuthHelperClass {
  private static instance: AuthHelperClass;

  private constructor() {
    //
  }

  public static getInstance() {
    if (!AuthHelperClass.instance) {
      AuthHelperClass.instance = new AuthHelperClass();
    }
    return AuthHelperClass.instance;
  }

  private getDefaultLinkDomain() {
    const domain = AppHelper.getConfig(AppConfigKey.DefaultLink).match(
      '.*([^.]+|)(com|net|org|info|coop|int|co.uk|org.uk|ac.uk|uk|ro)$|localhost',
    );

    return domain?.[0];
  }

  public getCookieByName(request: any, cookieName: string): string {
    try {
      return request.headers.cookie
        .split(';')
        .find((cookie) => cookie.match(cookieName));
    } catch (error) {
      return null;
    }
  }

  public secureJwtToken(req: Request, token: any): Promise<TokenPayload> {
    const jwtToken = token;
    const isDevelopment = AppHelper.checkEnvironment(Environment.Development);

    req.res.cookie('signature', token.signature, {
      expires: DateHelper.addDays(100),
      httpOnly: true,
      secure: !isDevelopment,
      domain: this.getDefaultLinkDomain(),
      path: '/',
      sameSite: 'lax',
    });
    delete jwtToken.signature;

    return jwtToken;
  }

  public computeJwtToken() {
    return (req: Request): string | null => {
      return this.createJwtSecureToken(req);
    };
  }

  public createJwtSecureToken(req: Request, accessToken?: string) {
    const signatureCookie: string = this.getCookieByName(req, 'signature');
    const authorization: string = accessToken
      ? accessToken
      : req.headers.authorization?.replace('Bearer ', '');

    if (!authorization || !signatureCookie) {
      return null;
    }

    const signature = signatureCookie.split('=')[1];
    const token = `${authorization}.${signature}`;

    return token;
  }

  public clearSignature(req: Request) {
    req.res.clearCookie('signature');
  }
}

const AuthHelper = AuthHelperClass.getInstance();
export default AuthHelper;
