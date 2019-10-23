
import {NgrxManagerAction, NgrxManagerConfig} from '@softwarepioniere/ngrx-manager';


export const PING = '[OrgaappModul] Ping laden';
export const PING_ERFOLGREICH = '[OrgaappModul] Ping laden erfolgreich';
export const PING_FEHLER = '[OrgaappModul] Ping Ladefehler';



export class PingAction implements NgrxManagerAction {
    readonly type = PING;
    constructor(public optPayload: any = null, public ngrxManager: NgrxManagerConfig = null) {}
    }
export class PingErfolgreichAction implements NgrxManagerAction {
    readonly type = PING_ERFOLGREICH;
    constructor(public string: string, public optPayload: any = null, public ngrxManager: NgrxManagerConfig = null) {}
    }
export class PingFehlerAction implements NgrxManagerAction {
    readonly type = PING_FEHLER;
    constructor(public payload: any, public optPayload: any = null, public ngrxManager: NgrxManagerConfig = null) {}
    }
    

export type OrgaappQueryPingActions =
    PingAction
    | PingErfolgreichAction
    | PingFehlerAction
    ;
