import {Injectable, Injector} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {catchError, flatMap, map} from 'rxjs/operators';

import * as ac from './actions.query.templates-constants';
import * as api from '../../../clients/orgaapp';


import {RequestMethod, RequestType, NgrxManagerService} from '@softwarepioniere/ngrx-manager';

@Injectable()
export class OrgaappTemplatesConstantsEffects {

    @Effect()
        TemplatesConstants$ = this.actions$.pipe(
            ofType(ac.GET_TEMPLATES_CONSTANTS),
            map((x: ac.GetTemplatesConstantsAction) => {
                return this.ngrxManagerService.checkRequestCall(ac.GET_TEMPLATES_CONSTANTS, x, RequestMethod.QUERY, RequestType.Anfrage);
            }),
            filter(x => typeof x !== 'boolean'),
            flatMap((x: ac.GetTemplatesConstantsAction) => {
                const optPayload = (x !== undefined && x !== null && x.optPayload !== undefined) ? x.optPayload : null;
                return this.getService().getTemplatesConstants().pipe(
                    map((result: any) => {
                        const nextAction = new ac.GetTemplatesConstantsErfolgreichAction(result,  optPayload);
                        this.ngrxManagerService.checkRequestResult(ac.GET_TEMPLATES_CONSTANTS, x, RequestMethod.QUERY, RequestType.Erfolgreich, nextAction);
                        return nextAction;
                    }),
                    catchError((error: any) => {
                        const nextAction = new ac.GetTemplatesConstantsFehlerAction(error,  optPayload);
                        this.ngrxManagerService.checkRequestResult(ac.GET_TEMPLATES_CONSTANTS, x, RequestMethod.QUERY, RequestType.Fehler, nextAction, error);
                        return of(nextAction);
                    })
                );
        })
    );

    private service: api.TemplatesService = null;

    constructor(
        private actions$: Actions,
        private injector: Injector,
        private ngrxManagerService: NgrxManagerService) {
    }

    private getService(): api.TemplatesService {
            if (this.service === null) {
                this.service = this.injector.get(api.TemplatesService);
            }
            return this.service;
        }

}
