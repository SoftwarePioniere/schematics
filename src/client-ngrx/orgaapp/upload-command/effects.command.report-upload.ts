import {Injectable, Injector} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {catchError, flatMap, map} from 'rxjs/operators';

import * as ac from './actions.command.report-upload';
import * as api from '../../../clients/orgaapp';


import {RequestMethod, RequestType, NgrxManagerService} from '@softwarepioniere/ngrx-manager';

@Injectable()
export class OrgaappReportUploadEffects {

    @Effect()
        ReportUpload$ = this.actions$.pipe(
            ofType(ac.POST_REPORT_UPLOAD),
            map((x: ac.PostReportUploadAction) => {
                return this.ngrxManagerService.checkRequestCall(ac.POST_REPORT_UPLOAD, x, RequestMethod.COMMAND, RequestType.Anfrage);
            }),
            filter(x => typeof x !== 'boolean'),
            flatMap((x: ac.PostReportUploadAction) => {
                const optPayload = (x !== undefined && x !== null && x.optPayload !== undefined) ? x.optPayload : null;
                return this.getService().postReportUpload(x.blob).pipe(
                    map((result: any) => {
                        const nextAction = new ac.PostReportUploadErfolgreichAction(result, x.blob,  optPayload);
                        this.ngrxManagerService.checkRequestResult(ac.POST_REPORT_UPLOAD, x, RequestMethod.COMMAND, RequestType.Erfolgreich, nextAction);
                        return nextAction;
                    }),
                    catchError((error: any) => {
                        const nextAction = new ac.PostReportUploadFehlerAction(error, x.blob,  optPayload);
                        this.ngrxManagerService.checkRequestResult(ac.POST_REPORT_UPLOAD, x, RequestMethod.COMMAND, RequestType.Fehler, nextAction, error);
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
