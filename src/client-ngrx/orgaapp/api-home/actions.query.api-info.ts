import * as api from '../../../clients/orgaapp'; 
import {NgrxManagerAction, NgrxManagerConfig} from '@softwarepioniere/ngrx-manager';


export const GET_API_INFO = '[OrgaappModul] GetApiInfo laden';
export const GET_API_INFO_ERFOLGREICH = '[OrgaappModul] GetApiInfo laden erfolgreich';
export const GET_API_INFO_FEHLER = '[OrgaappModul] GetApiInfo Ladefehler';



export class GetApiInfoAction implements NgrxManagerAction {
    readonly type = GET_API_INFO;
    constructor(public optPayload: any = null, public ngrxManager: NgrxManagerConfig = null) {}
    }
export class GetApiInfoErfolgreichAction implements NgrxManagerAction {
    readonly type = GET_API_INFO_ERFOLGREICH;
    constructor(public apiInfo: api.ApiInfo, public optPayload: any = null, public ngrxManager: NgrxManagerConfig = null) {}
    }
export class GetApiInfoFehlerAction implements NgrxManagerAction {
    readonly type = GET_API_INFO_FEHLER;
    constructor(public payload: any, public optPayload: any = null, public ngrxManager: NgrxManagerConfig = null) {}
    }
    

export type OrgaappQueryApiInfoActions =
    GetApiInfoAction
    | GetApiInfoErfolgreichAction
    | GetApiInfoFehlerAction
    ;
