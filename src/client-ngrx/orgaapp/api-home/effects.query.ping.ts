import {Injectable, Injector} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {catchError, flatMap, map} from 'rxjs/operators';

import * as ac from './actions.query.ping';
import * as api from '../../../clients/orgaapp';


import {RequestMethod, RequestType, NgrxManagerService} from '@softwarepioniere/ngrx-manager';

@Injectable()
export class OrgaappPingEffects {

    @Effect()
        Ping$ = this.actions$.pipe(
            ofType(ac.PING),
            map((x: ac.PingAction) => {
                return this.ngrxManagerService.checkRequestCall(ac.PING, x, RequestMethod.QUERY, RequestType.Anfrage);
            }),
            filter(x => typeof x !== 'boolean'),
            flatMap((x: ac.PingAction) => {
                const optPayload = (x !== undefined && x !== null && x.optPayload !== undefined) ? x.optPayload : null;
                return this.getService().ping().pipe(
                    map((result: any) => {
                        const nextAction = new ac.PingErfolgreichAction(result,  optPayload);
                        this.ngrxManagerService.checkRequestResult(ac.PING, x, RequestMethod.QUERY, RequestType.Erfolgreich, nextAction);
                        return nextAction;
                    }),
                    catchError((error: any) => {
                        const nextAction = new ac.PingFehlerAction(error,  optPayload);
                        this.ngrxManagerService.checkRequestResult(ac.PING, x, RequestMethod.QUERY, RequestType.Fehler, nextAction, error);
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
