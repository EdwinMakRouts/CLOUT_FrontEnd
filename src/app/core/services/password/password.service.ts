import { Injectable, Injector } from '@angular/core';
import { Repository } from '../../base/repository.repository';
import { PasswordRepository } from '../../repository/password/password.service';

@Injectable({
  providedIn: 'root',
})
export class PasswordService {
  constructor(private repo: PasswordRepository) {}

  forgotPassword(email: string) {
    return this.repo.forgotPassword(email);
  }

  isCodeCorrect(email: string, code: number) {
    return this.repo.isCodeCorrect(email, code);
  }

  resetPassword(email: string, code: number, password: string) {
    return this.repo.resetPassword(email, code, password);
  }
}
