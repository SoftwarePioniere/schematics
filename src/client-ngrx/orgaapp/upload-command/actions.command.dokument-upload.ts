import * as api from '../../../clients/orgaapp'; 
import {NgrxManagerAction, NgrxManagerConfig} from '@softwarepioniere/ngrx-manager';


export const POST_DOKUMENT_UPLOAD = '[OrgaappModul] PostDokumentUpload laden';
export const POST_DOKUMENT_UPLOAD_ERFOLGREICH = '[OrgaappModul] PostDokumentUpload laden erfolgreich';
export const POST_DOKUMENT_UPLOAD_FEHLER = '[OrgaappModul] PostDokumentUpload Ladefehler';



export class PostDokumentUploadAction implements NgrxManagerAction {
    readonly type = POST_DOKUMENT_UPLOAD;
    constructor(public blob: Blob, public optPayload: any = null, public ngrxManager: NgrxManagerConfig = null) {}
    }
export class PostDokumentUploadErfolgreichAction implements NgrxManagerAction {
    readonly type = POST_DOKUMENT_UPLOAD_ERFOLGREICH;
    constructor(public dokumentUploadResponse: api.DokumentUploadResponse, public blob: Blob, public optPayload: any = null, public ngrxManager: NgrxManagerConfig = null) {}
    }
export class PostDokumentUploadFehlerAction implements NgrxManagerAction {
    readonly type = POST_DOKUMENT_UPLOAD_FEHLER;
    constructor(public payload: any, public blob: Blob, public optPayload: any = null, public ngrxManager: NgrxManagerConfig = null) {}
    }
    

export type OrgaappCommandDokumentUploadActions =
    PostDokumentUploadAction
    | PostDokumentUploadErfolgreichAction
    | PostDokumentUploadFehlerAction
    ;
