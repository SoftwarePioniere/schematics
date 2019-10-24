
import {NgrxManagerAction, NgrxManagerConfig} from '@softwarepioniere/ngrx-manager';


export const GET_BILD_DOWNLOAD = '[OrgaappModul] GetBildDownload laden';
export const GET_BILD_DOWNLOAD_ERFOLGREICH = '[OrgaappModul] GetBildDownload laden erfolgreich';
export const GET_BILD_DOWNLOAD_FEHLER = '[OrgaappModul] GetBildDownload Ladefehler';



export class GetBildDownloadAction implements NgrxManagerAction {
    readonly type = GET_BILD_DOWNLOAD;
    constructor( public bildId:string , public optPayload: any = null, public ngrxManager: NgrxManagerConfig = null) {}
    }
export class GetBildDownloadErfolgreichAction implements NgrxManagerAction {
    readonly type = GET_BILD_DOWNLOAD_ERFOLGREICH;
    constructor(public stringPayload: string,  public bildId:string , public optPayload: any = null, public ngrxManager: NgrxManagerConfig = null) {}
    }
export class GetBildDownloadFehlerAction implements NgrxManagerAction {
    readonly type = GET_BILD_DOWNLOAD_FEHLER;
    constructor(public payload: any,  public bildId:string , public optPayload: any = null, public ngrxManager: NgrxManagerConfig = null) {}
    }
    

export type OrgaappQueryBildDownloadActions =
    GetBildDownloadAction
    | GetBildDownloadErfolgreichAction
    | GetBildDownloadFehlerAction
    ;
