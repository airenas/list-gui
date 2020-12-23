import {Injectable, Inject} from '@angular/core';
import {environment} from '../environments/environment';

@Injectable()
export class Config {
    public sendFileUrl: string;
    public recognizersUrl: string;
    public statusUrl: string;
    public subscribeUrl: string;
    public audioUrl: string;
    public resultUrl: string;
    public editorUrl: string;
    public baseServiceUrl: string;

    constructor() {
        this.init('');
    }

    init(prefix: string) {
        this.baseServiceUrl = prefix;
        this.sendFileUrl = prefix + environment.sendFileUrl + 'upload';
        this.recognizersUrl = prefix + environment.sendFileUrl + 'recognizers';
        this.statusUrl = prefix + environment.statusUrl + 'status/';
        this.subscribeUrl = environment.statusUrl + 'subscribe';
        this.audioUrl = prefix + environment.resultUrl + 'audio/';
        this.resultUrl = prefix + environment.resultUrl + 'result/';
        this.editorUrl = prefix + environment.editorUrl;
    }
}
