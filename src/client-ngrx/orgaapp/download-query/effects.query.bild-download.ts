import {Injectable, Injector} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {catchError, flatMap, map} from 'rxjs/operators';

import * as ac from './actions.query.bild-download';
import * as api from '../../../clients/orgaapp';


import {RequestMethod, RequestType, NgrxManagerService} from '@softwarepioniere/ngrx-manager';

@Injectable()
export class OrgaappBildDownloadEffects {

    @Effect()
        BildDownload$ = this.actions$.pipe(
            ofType(ac.GET_BILD_DOWNLOAD),
            map((x: ac.GetBildDownloadAction) => {
                return this.ngrxManagerService.checkRequestCall(ac.GET_BILD_DOWNLOAD + x.bildId, x, RequestMethod.QUERY, RequestType.Anfrage);
            }),
            filter(x => typeof x !== 'boolean'),
            flatMap((x: ac.GetBildDownloadAction) => {
                const optPayload = (x !== undefined && x !== null && x.optPayload !== undefined) ? x.optPayload : null;
                return this.getService().getBildDownload(x.bildId).pipe(
                    map((result: any) => {
                        const nextAction = new ac.GetBildDownloadErfolgreichAction(result, x.bildId,  optPayload);
                        this.ngrxManagerService.checkRequestResult(ac.GET_BILD_DOWNLOAD + x.bildId, x, RequestMethod.QUERY, RequestType.Erfolgreich, nextAction);
                        return nextAction;
                    }),
                    catchError((error: any) => {
                        const nextAction = new ac.GetBildDownloadFehlerAction(error, x.bildId,  optPayload);
                        this.ngrxManagerService.checkRequestResult(ac.GET_BILD_DOWNLOAD + x.bildId, x, RequestMethod.QUERY, RequestType.Fehler, nextAction, error);
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