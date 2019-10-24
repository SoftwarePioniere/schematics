
import {NgrxManagerAction, NgrxManagerConfig} from '@softwarepioniere/ngrx-manager';


export const GET_TEMPLATES_CONSTANTS = '[OrgaappModul] GetTemplatesConstants laden';
export const GET_TEMPLATES_CONSTANTS_ERFOLGREICH = '[OrgaappModul] GetTemplatesConstants laden erfolgreich';
export const GET_TEMPLATES_CONSTANTS_FEHLER = '[OrgaappModul] GetTemplatesConstants Ladefehler';



export class GetTemplatesConstantsAction implements NgrxManagerAction {
    readonly type = GET_TEMPLATES_CONSTANTS;
    constructor(public optPayload: any = null, public ngrxManager: NgrxManagerConfig = null) {}
    }
export class GetTemplatesConstantsErfolgreichAction implements NgrxManagerAction {
    readonly type = GET_TEMPLATES_CONSTANTS_ERFOLGREICH;
    constructor(public stringPayload: string, public optPayload: any = null, public ngrxManager: NgrxManagerConfig = null) {}
    }
export class GetTemplatesConstantsFehlerAction implements NgrxManagerAction {
    readonly type = GET_TEMPLATES_CONSTANTS_FEHLER;
    constructor(public payload: any, public optPayload: any = null, public ngrxManager: NgrxManagerConfig = null) {}
    }
    

export type OrgaappQueryTemplatesConstantsActions =
    GetTemplatesConstantsAction
    | GetTemplatesConstantsErfolgreichAction
    | GetTemplatesConstantsFehlerAction
    ;
