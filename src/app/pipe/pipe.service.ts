import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class PipeService {
    statusData: any = {};
    noGetStatusUrl: any = {};

    dictData: any = {};
    noGetDictUrl: any = {};
    
    constructor() {};
}