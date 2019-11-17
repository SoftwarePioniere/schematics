import {Injectable, Injector} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {catchError, flatMap, map} from 'rxjs/operators';

import * as ac from './actions.<%= actiontype %>.<%= dasherize(methodWithoutType) %>';
import * as api from '<%= importpath %>clients/<%= clientname %>';

<% if (useNgrxManager) {%>
import {RequestMethod, RequestType, NgrxManagerService} from '@softwarepioniere/ngrx-manager';

@Injectable()
export class <%= classify(clientname) %><%= classify(methodWithoutType) %>Effects {

    @Effect()
        <%= classify(methodWithoutType) %>$ = this.actions$.pipe(
            ofType(ac.<%= underscore(classify(method)).toUpperCase() %>),
            map((x: ac.<%= classify(method) %>Action) => {
                return this.ngrxManagerService.checkRequestCall(ac.<%= underscore(classify(method)).toUpperCase() %><% if (actiontype.toUpperCase() == 'QUERY') { %><%= requestparamsVariableIdentifier %><% } %>, x, RequestMethod.<%= actiontype.toUpperCase() %>, RequestType.Anfrage);
            }),
            flatMap((x: boolean|ac.<%= classify(method) %>Action) => {
                if (typeof x === 'boolean') {
                    const nextAction = new ac.<%= classify(method) %>NichtAusgefuehrtAction();
                    return of(nextAction);
                } else {
                    const optPayload = (x !== undefined && x !== null && x.optPayload !== undefined) ? x.optPayload : null;
                    return this.getService().<%= method %>(<%= requestparamsVariableNames %>).pipe(
                        map((result: any) => {
                            const nextAction = new ac.<%= classify(method) %>ErfolgreichAction(<% if(responseparamsVariableNames!='') {%>result<% } %><% if (responseparamsVariableNames!='') {%>, <% } %><%= requestparamsVariableNames %><% if (requestparamsVariableNames!='') {%>, <% } %> optPayload);
                            this.ngrxManagerService.checkRequestResult(ac.<%= underscore(classify(method)).toUpperCase() %><% if (actiontype.toUpperCase() == 'QUERY') { %><%= requestparamsVariableIdentifier %><% } %>, x, RequestMethod.<%= actiontype.toUpperCase() %>, RequestType.Erfolgreich, nextAction);
                            return nextAction;
                        }),
                        catchError((error: any) => {
                            const nextAction = new ac.<%= classify(method) %>FehlerAction(error, <%= requestparamsVariableNames %><% if (requestparamsVariableNames!='') {%>, <% } %> optPayload);
                            this.ngrxManagerService.checkRequestResult(ac.<%= underscore(classify(method)).toUpperCase() %><% if (actiontype.toUpperCase() == 'QUERY') { %><%= requestparamsVariableIdentifier %><% } %>, x, RequestMethod.<%= actiontype.toUpperCase() %>, RequestType.Fehler, nextAction, error);
                            return of(nextAction);
                        })
                    );
                }

        })
    );

    private service: api.<%= classify(service) %>Service = null;

    constructor(
        private actions$: Actions,
        private injector: Injector,
        private ngrxManagerService: NgrxManagerService) {
    }

    private getService(): api.<%= classify(service) %>Service {
            if (this.service === null) {
                this.service = this.injector.get(api.<%= classify(service) %>Service);
            }
            return this.service;
        }
<% } else { %>
    @Injectable()
    export class <%= classify(clientname) %><%= classify(methodWithoutType) %>Effects {

        @Effect()
            <%= classify(methodWithoutType) %>$ = this.actions$.pipe(
                ofType(ac.<%= underscore(classify(method)).toUpperCase() %>),
                flatMap((x: ac.<%= classify(method) %>Action) => {
                const optPayload = (x !== undefined && x !== null && x.optPayload !== undefined) ? x.optPayload : null;
                return this.getService().<%= method %>(<%= requestparamsVariableNames %>).pipe(
                    map((result: any) => {
                        const nextAction = new ac.<%= classify(method) %>ErfolgreichAction(<% if(responseparamsVariableNames!='') {%>result<% } %><% if (responseparamsVariableNames!='') {%>, <% } %><%= requestparamsVariableNames %><% if (requestparamsVariableNames!='') {%>, <% } %> optPayload);
                        return nextAction;
                    }),
                    catchError((error: any) => {
                        const nextAction = new ac.<%= classify(method) %>FehlerAction(error, <%= requestparamsVariableNames %><% if (requestparamsVariableNames!='') {%>, <% } %> optPayload);
                        return of(nextAction);
                    })
                );
            })
        );

        private service: api.<%= classify(service) %>Service = null;

        constructor(
            private actions$: Actions,
            private injector: Injector) {
        }

        private getService(): api.<%= classify(service) %>Service {
                if (this.service === null) {
                    this.service = this.injector.get(api.<%= classify(service) %>Service);
                }
                return this.service;
            }
        <% } %>
}
