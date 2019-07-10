import { Injectable } from '@angular/core';
import {Effect, Actions, ofType} from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import {filter, map, flatMap} from 'rxjs/operators';

import * as ac from './actions.<%= actiontype %>.<%= dasherize(methodWithoutType) %>';
import * as api from '<%= importpath %>clients/<%= clientname %>';

import {RequestMethod, RequestType, NgrxManagerService} from '@softwarepioniere/ngrx-manager';

@Injectable()
export class <%= classify(clientname) %><%= classify(methodWithoutType) %>Effects  {
    @Effect()
        <%= classify(methodWithoutType) %>$: Observable<Action> = this.actions$.pipe(
            ofType(ac.<%= underscore(classify(method)).toUpperCase() %>),
            map((x: ac.<%= classify(method) %>Action) => {
                return this.ngrxManagerService.checkRequestCall(ac.<%= underscore(classify(method)).toUpperCase() %><% if (actiontype.toUpperCase() == 'QUERY') { %><%= requestparamsVariableIdentifier %><% } %>, x, RequestMethod.<%= actiontype.toUpperCase() %>, RequestType.Anfrage);
            }),
            filter(x => typeof x !== 'boolean'),
            flatMap((x: ac.<%= classify(method) %>Action) => {
                const optPayload = (x !== undefined && x !== null && x.optPayload !== undefined) ? x.optPayload : null;
                return this._<%= camelize(classify(service)) %>Service.<%= method %>(<%= requestparamsVariableNames %>)
                    .map((result: any) => {
                        const nextAction = new ac.<%= classify(method) %>ErfolgreichAction(<% if(responseparamsVariableNames!='') {%>result<% } %><% if (requestparamsVariableNames !='' && responseparamsVariableNames!='') {%>, <% } %><%= requestparamsVariableNames %>, optPayload);
                        this.ngrxManagerService.checkRequestResult(ac.<%= underscore(classify(method)).toUpperCase() %><% if (actiontype.toUpperCase() == 'QUERY') { %><%= requestparamsVariableIdentifier %><% } %>, x, RequestMethod.<%= actiontype.toUpperCase() %>, RequestType.Erfolgreich, nextAction);
                        return nextAction;
                    })
                    .catch((error: any) => {
                        const nextAction = new ac.<%= classify(method) %>FehlerAction(error<% if (requestparamsVariableNames !='') {%>, <% } %><%= requestparamsVariableNames %>, optPayload);
                        this.ngrxManagerService.checkRequestResult(ac.<%= underscore(classify(method)).toUpperCase() %><% if (actiontype.toUpperCase() == 'QUERY') { %><%= requestparamsVariableIdentifier %><% } %>, x, RequestMethod.<%= actiontype.toUpperCase() %>, RequestType.Fehler, nextAction, error);
                        return of(nextAction);
                    });
        })
    );

    constructor(
        private actions$: Actions,
        private _<%= camelize(classify(service)) %>Service: api.<%= classify(service) %>Service,
        private ngrxManagerService: NgrxManagerService) {
    }
}
