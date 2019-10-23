import {Injectable, Injector} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {catchError, flatMap, map} from 'rxjs/operators';

import * as ac from './actions.query.api-query-download-dokument-by-dokument-id';
import * as api from '../../../clients/orgaapp';


import {RequestMethod, RequestType, NgrxManagerService} from '@softwarepioniere/ngrx-manager';

@Injectable()
export class OrgaappApiQueryDownloadDokumentByDokumentIdEffects {

    @Effect()
        ApiQueryDownloadDokumentByDokumentId$ = this.actions$.pipe(
            ofType(ac.API_QUERY_DOWNLOAD_DOKUMENT_BY_DOKUMENT_ID_GET),
            map((x: ac.ApiQueryDownloadDokumentByDokumentIdGetAction) => {
                return this.ngrxManagerService.checkRequestCall(ac.API_QUERY_DOWNLOAD_DOKUMENT_BY_DOKUMENT_ID_GET + x.dokumentId, x, RequestMethod.QUERY, RequestType.Anfrage);
            }),
            filter(x => typeof x !== 'boolean'),
            flatMap((x: ac.ApiQueryDownloadDokumentByDokumentIdGetAction) => {
                const optPayload = (x !== undefined && x !== null && x.optPayload !== undefined) ? x.optPayload : null;
                return this.getService().apiQueryDownloadDokumentByDokumentIdGet(x.dokumentId).pipe(
                    map((result: any) => {
                        const nextAction = new ac.ApiQueryDownloadDokumentByDokumentIdGetErfolgreichAction(result, x.dokumentId,  optPayload);
                        this.ngrxManagerService.checkRequestResult(ac.API_QUERY_DOWNLOAD_DOKUMENT_BY_DOKUMENT_ID_GET + x.dokumentId, x, RequestMethod.QUERY, RequestType.Erfolgreich, nextAction);
                        return nextAction;
                    }),
                    catchError((error: any) => {
                        const nextAction = new ac.ApiQueryDownloadDokumentByDokumentIdGetFehlerAction(error, x.dokumentId,  optPayload);
                        this.ngrxManagerService.checkRequestResult(ac.API_QUERY_DOWNLOAD_DOKUMENT_BY_DOKUMENT_ID_GET + x.dokumentId, x, RequestMethod.QUERY, RequestType.Fehler, nextAction, error);
                        return of(nextAction);
                    })
                );
        })
    );

    private service: api.DownloadQueryService = null;

    constructor(
        private actions$: Actions,
        private injector: Injector,
        private ngrxManagerService: NgrxManagerService) {
    }

    private getService(): api.DownloadQueryService {
            if (this.service === null) {
                this.service = this.injector.get(api.DownloadQueryService);
            }
            return this.service;
        }

}
