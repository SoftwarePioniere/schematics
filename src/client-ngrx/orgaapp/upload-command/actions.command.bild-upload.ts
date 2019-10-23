import * as api from '../../../clients/orgaapp'; 
import {NgrxManagerAction, NgrxManagerConfig} from '@softwarepioniere/ngrx-manager';


export const POST_BILD_UPLOAD = '[OrgaappModul] PostBildUpload laden';
export const POST_BILD_UPLOAD_ERFOLGREICH = '[OrgaappModul] PostBildUpload laden erfolgreich';
export const POST_BILD_UPLOAD_FEHLER = '[OrgaappModul] PostBildUpload Ladefehler';



export class PostBildUploadAction implements NgrxManagerAction {
    readonly type = POST_BILD_UPLOAD;
    constructor(public blob: Blob,public string: string,public string: string, public optPayload: any = null, public ngrxManager: NgrxManagerConfig = null) {}
    }
export class PostBildUploadErfolgreichAction implements NgrxManagerAction {
    readonly type = POST_BILD_UPLOAD_ERFOLGREICH;
    constructor(public bildUploadResponse: api.BildUploadResponse, public blob: Blob,public string: string,public string: string, public optPayload: any = null, public ngrxManager: NgrxManagerConfig = null) {}
    }
export class PostBildUploadFehlerAction implements NgrxManagerAction {
    readonly type = POST_BILD_UPLOAD_FEHLER;
    constructor(public payload: any, public blob: Blob,public string: string,public string: string, public optPayload: any = null, public ngrxManager: NgrxManagerConfig = null) {}
    }
    

export type OrgaappCommandBildUploadActions =
    PostBildUploadAction
    | PostBildUploadErfolgreichAction
    | PostBildUploadFehlerAction
    ;
