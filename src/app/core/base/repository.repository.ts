import { HttpClient, HttpParams } from '@angular/common/http';
import { Injector } from '@angular/core';
import { Observable } from 'rxjs';

export abstract class Repository {
  private paths = Object.freeze({
    dev: 'https://api.jorma28j.upv.edu.es',
    prod: 'https://api-pin.crazyjmb.com',
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
    return this.http.request<T>(method, `${this.basePath}${url}`, { body });
  }
}
