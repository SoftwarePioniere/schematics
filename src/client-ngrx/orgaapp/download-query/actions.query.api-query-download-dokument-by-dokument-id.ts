
import {NgrxManagerAction, NgrxManagerConfig} from '@softwarepioniere/ngrx-manager';


export const API_QUERY_DOWNLOAD_DOKUMENT_BY_DOKUMENT_ID_GET = '[OrgaappModul] ApiQueryDownloadDokumentByDokumentIdGet laden';
export const API_QUERY_DOWNLOAD_DOKUMENT_BY_DOKUMENT_ID_GET_ERFOLGREICH = '[OrgaappModul] ApiQueryDownloadDokumentByDokumentIdGet laden erfolgreich';
export const API_QUERY_DOWNLOAD_DOKUMENT_BY_DOKUMENT_ID_GET_FEHLER = '[OrgaappModul] ApiQueryDownloadDokumentByDokumentIdGet Ladefehler';



export class ApiQueryDownloadDokumentByDokumentIdGetAction implements NgrxManagerAction {
    readonly type = API_QUERY_DOWNLOAD_DOKUMENT_BY_DOKUMENT_ID_GET;
    constructor( public dokumentId:string , public optPayload: any = null, public ngrxManager: NgrxManagerConfig = null) {}
    }
export class ApiQueryDownloadDokumentByDokumentIdGetErfolgreichAction implements NgrxManagerAction {
    readonly type = API_QUERY_DOWNLOAD_DOKUMENT_BY_DOKUMENT_ID_GET_ERFOLGREICH;
    constructor(public stringPayload: string,  public dokumentId:string , public optPayload: any = null, public ngrxManager: NgrxManagerConfig = null) {}
    }
export class ApiQueryDownloadDokumentByDokumentIdGetFehlerAction implements NgrxManagerAction {
    readonly type = API_QUERY_DOWNLOAD_DOKUMENT_BY_DOKUMENT_ID_GET_FEHLER;
    constructor(public payload: any,  public dokumentId:string , public optPayload: any = null, public ngrxManager: NgrxManagerConfig = null) {}
    }
    

export type OrgaappQueryApiQueryDownloadDokumentByDokumentIdActions =
    ApiQueryDownloadDokumentByDokumentIdGetAction
    | ApiQueryDownloadDokumentByDokumentIdGetErfolgreichAction
    | ApiQueryDownloadDokumentByDokumentIdGetFehlerAction
    ;
