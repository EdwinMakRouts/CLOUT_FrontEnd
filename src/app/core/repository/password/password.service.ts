import { Injectable, Injector } from '@angular/core';
import { Repository } from '../../base/repository.repository';

@Injectable({
  providedIn: 'root',
})
export class PasswordRepository extends Repository {
  constructor(injector: Injector) {
    super(injector);
  }

  forgotPassword(email: string) {
    return this.doRequest('post', '/password/forgot', {
      email: email,
    });
  }

  isCodeCorrect(email: string, code: number) {
    return this.doRequest('post', '/password/code', {
      email: email,
      code: code,
    });
  }

  resetPassword(email: string, code: number, password: string) {
    return this.doRequest('post', '/password/reset', {
      email: email,
      code: code,
      password: password,
    });
  }
}
