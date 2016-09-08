import {inject} from 'aurelia-framework';
import fetch from 'whatwg-fetch';
import {HttpClient, json} from 'aurelia-fetch-client';
import AppConfig from 'resources/app-config'
import AuthService from 'resources/services/auth-service';

@inject(HttpClient, AuthService, AppConfig)
export default class ApiBaseService {
    constructor(http, authService, appConfig) {
        this.http = http;
        this.http.configure(config => {
            config
              .withBaseUrl(appConfig.apiUrl)
              .withDefaults({
                  headers: {
                      'content-type':     'application/json',
                      'Accept':           'application/json',
                      'X-Requested-With': 'Fetch',
                  }
              })
              .withInterceptor({
                  request(request) {
                      return authService.authorizeRequest(request);
                  }
              });
        });

        this.baseCorsResponseHeaderNames = ['cache-control', 'content-type'];
    }

    async get(path) {
        const response = await this.http.fetch(path);
        return response.json();
    }

    async post(path, params) {
        const response = await this.http.fetch(path, {
            method: 'post',
            body:   json(params)
        });
        if (response.status != 201) {
            // Standard response with JSON body
            return response.json();
        } else {
            // Status "Created", our API sends an empty body, so we expose the headers
            // instead.
            const headers = {};
            for (let [name, value] of response.headers) {
              if (!this.baseCorsResponseHeaderNames.includes(name)) {
                headers[name] = value;
            }
    }
    return new Promise((resolve, reject) => {
        if (Object.keys(headers).length > 0) {
            resolve(headers);
        } else {
            reject(Error("Response 201 didn't contain any resource-related headers"));
        }
    });
}
}
}