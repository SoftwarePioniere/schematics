import * as api from '../../../clients/orgaapp'; 
import {NgrxManagerAction, NgrxManagerConfig} from '@softwarepioniere/ngrx-manager';


export const POST_REPORT_UPLOAD = '[OrgaappModul] PostReportUpload laden';
export const POST_REPORT_UPLOAD_ERFOLGREICH = '[OrgaappModul] PostReportUpload laden erfolgreich';
export const POST_REPORT_UPLOAD_FEHLER = '[OrgaappModul] PostReportUpload Ladefehler';



export class PostReportUploadAction implements NgrxManagerAction {
    readonly type = POST_REPORT_UPLOAD;
    constructor( public file:Blob , public optPayload: any = null, public ngrxManager: NgrxManagerConfig = null) {}
    }
export class PostReportUploadErfolgreichAction implements NgrxManagerAction {
    readonly type = POST_REPORT_UPLOAD_ERFOLGREICH;
    constructor(public dokumentUploadResponse: api.DokumentUploadResponse,  public file:Blob , public optPayload: any = null, public ngrxManager: NgrxManagerConfig = null) {}
    }
export class PostReportUploadFehlerAction implements NgrxManagerAction {
    readonly type = POST_REPORT_UPLOAD_FEHLER;
    constructor(public payload: any,  public file:Blob , public optPayload: any = null, public ngrxManager: NgrxManagerConfig = null) {}
    }
    

export type OrgaappCommandReportUploadActions =
    PostReportUploadAction
    | PostReportUploadErfolgreichAction
    | PostReportUploadFehlerAction
    ;
