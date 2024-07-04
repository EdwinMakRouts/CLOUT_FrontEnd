import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injector } from '@angular/core';
import { Observable } from 'rxjs';

export abstract class Repository {
  private paths = Object.freeze({
    dev: 'https://api.jorma28j.upv.edu.es',
    prod: 'https://api-pin.crazyjmb.com',
    temp: 'https://0b22-91-106-20-32.ngrok-free.app',
    localhost: 'http://localhost:3000',
  });
  protected basePath = this.paths.localhost;
  protected http: HttpClient = this.injector.get(HttpClient);

  constructor(protected injector: Injector) {}

  protected doRequest<T>(
    method: keyof HttpClient,
    url: string,
    body: unknown = undefined,
    params?: keyof HttpParams
  ): Observable<T> {
    const headers = new HttpHeaders().set(
      'ngrok-skip-browser-warning',
      '69420'
    );
    return this.http.request<T>(method, `${this.basePath}${url}`, {
      body,
      headers,
    });
  }
}
