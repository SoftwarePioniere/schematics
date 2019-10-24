import {Injectable, Injector} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {catchError, flatMap, map} from 'rxjs/operators';

import * as ac from './actions.command.dokument-upload';
import * as api from '../../../clients/orgaapp';


import {RequestMethod, RequestType, NgrxManagerService} from '@softwarepioniere/ngrx-manager';

@Injectable()
export class OrgaappDokumentUploadEffects {

    @Effect()
        DokumentUpload$ = this.actions$.pipe(
            ofType(ac.POST_DOKUMENT_UPLOAD),
            map((x: ac.PostDokumentUploadAction) => {
                return this.ngrxManagerService.checkRequestCall(ac.POST_DOKUMENT_UPLOAD, x, RequestMethod.COMMAND, RequestType.Anfrage);
            }),
            filter(x => typeof x !== 'boolean'),
            flatMap((x: ac.PostDokumentUploadAction) => {
                const optPayload = (x !== undefined && x !== null && x.optPayload !== undefined) ? x.optPayload : null;
                return this.getService().postDokumentUpload(x.file).pipe(
                    map((result: any) => {
                        const nextAction = new ac.PostDokumentUploadErfolgreichAction(result, x.file,  optPayload);
                        this.ngrxManagerService.checkRequestResult(ac.POST_DOKUMENT_UPLOAD, x, RequestMethod.COMMAND, RequestType.Erfolgreich, nextAction);
                        return nextAction;
                    }),
                    catchError((error: any) => {
                        const nextAction = new ac.PostDokumentUploadFehlerAction(error, x.file,  optPayload);
                        this.ngrxManagerService.checkRequestResult(ac.POST_DOKUMENT_UPLOAD, x, RequestMethod.COMMAND, RequestType.Fehler, nextAction, error);
                        return of(nextAction);
                    })
                );
        })
    );

    private service: api.UploadCommandService = null;

    constructor(
        private actions$: Actions,
        private injector: Injector,
        private ngrxManagerService: NgrxManagerService) {
    }

    private getService(): api.UploadCommandService {
            if (this.service === null) {
                this.service = this.injector.get(api.UploadCommandService);
            }
            return this.service;
        }

}
