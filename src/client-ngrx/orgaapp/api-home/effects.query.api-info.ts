import {Injectable, Injector} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {catchError, flatMap, map} from 'rxjs/operators';

import * as ac from './actions.query.api-info';
import * as api from '../../../clients/orgaapp';


import {RequestMethod, RequestType, NgrxManagerService} from '@softwarepioniere/ngrx-manager';

@Injectable()
export class OrgaappApiInfoEffects {

    @Effect()
        ApiInfo$ = this.actions$.pipe(
            ofType(ac.GET_API_INFO),
            map((x: ac.GetApiInfoAction) => {
                return this.ngrxManagerService.checkRequestCall(ac.GET_API_INFO, x, RequestMethod.QUERY, RequestType.Anfrage);
            }),
            filter(x => typeof x !== 'boolean'),
            flatMap((x: ac.GetApiInfoAction) => {
                const optPayload = (x !== undefined && x !== null && x.optPayload !== undefined) ? x.optPayload : null;
                return this.getService().getApiInfo().pipe(
                    map((result: any) => {
                        const nextAction = new ac.GetApiInfoErfolgreichAction(result,  optPayload);
                        this.ngrxManagerService.checkRequestResult(ac.GET_API_INFO, x, RequestMethod.QUERY, RequestType.Erfolgreich, nextAction);
                        return nextAction;
                    }),
                    catchError((error: any) => {
                        const nextAction = new ac.GetApiInfoFehlerAction(error,  optPayload);
                        this.ngrxManagerService.checkRequestResult(ac.GET_API_INFO, x, RequestMethod.QUERY, RequestType.Fehler, nextAction, error);
                        return of(nextAction);
                    })
                );
        })
    );

    private service: api.ApiHomeService = null;

    constructor(
        private actions$: Actions,
        private injector: Injector,
        private ngrxManagerService: NgrxManagerService) {
    }

    private getService(): api.ApiHomeService {
            if (this.service === null) {
                this.service = this.injector.get(api.ApiHomeService);
            }
            return this.service;
        }

}
