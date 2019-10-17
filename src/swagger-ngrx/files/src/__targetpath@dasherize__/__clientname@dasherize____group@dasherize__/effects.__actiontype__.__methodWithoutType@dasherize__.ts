import { Injectable, Injector } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import * as ac from './actions.<%= actiontype %>.<%= dasherize(methodWithoutType) %>';
import * as api from '<%= importpath %>clients/<%= clientname %>';

<% if (useNgrxManager) {%>
import {RequestMethod, RequestType, NgrxManagerService} from '@softwarepioniere/ngrx-manager';

@Injectable()
export class <%= classify(clientname) %><%= classify(methodWithoutType) %>Effects  {

    private service : api.<%= classify(service) %>Service = null;
    private getService() : api.<%= classify(service) %>Service {
            if (this.service === null) {
                this.service = this.injector.get(api.<%= classify(service) %>Service);
            }
            return this.service;
        }

    @Effect()
        <%= classify(methodWithoutType) %>$: Observable<Action> = this.actions$.pipe(
            ofType(ac.<%= underscore(classify(method)).toUpperCase() %>),
            map((x: ac.<%= classify(method) %>Action) => {
                return this.ngrxManagerService.checkRequestCall(ac.<%= underscore(classify(method)).toUpperCase() %><% if (actiontype.toUpperCase() == 'QUERY') { %><%= requestparamsVariableIdentifier %><% } %>, x, RequestMethod.<%= actiontype.toUpperCase() %>, RequestType.Anfrage);
            }),
            filter(x => typeof x !== 'boolean'),
            flatMap((x: ac.<%= classify(method) %>Action) => {
                const optPayload = (x !== undefined && x !== null && x.optPayload !== undefined) ? x.optPayload : null;
                return this.getService().<%= method %>(<%= requestparamsVariableNames %>)
                    .map((result: any) => {
                        const nextAction = new ac.<%= classify(method) %>ErfolgreichAction(<% if(responseparamsVariableNames!='') {%>result<% } %><% if (responseparamsVariableNames!='') {%>, <% } %><%= requestparamsVariableNames %><% if (requestparamsVariableNames!='') {%>, <% } %> optPayload);
                        this.ngrxManagerService.checkRequestResult(ac.<%= underscore(classify(method)).toUpperCase() %><% if (actiontype.toUpperCase() == 'QUERY') { %><%= requestparamsVariableIdentifier %><% } %>, x, RequestMethod.<%= actiontype.toUpperCase() %>, RequestType.Erfolgreich, nextAction);
                        return nextAction;
                    })
                    .catch((error: any) => {
                        const nextAction = new ac.<%= classify(method) %>FehlerAction(error, <%= requestparamsVariableNames %><% if (requestparamsVariableNames!='') {%>, <% } %> optPayload);
                        this.ngrxManagerService.checkRequestResult(ac.<%= underscore(classify(method)).toUpperCase() %><% if (actiontype.toUpperCase() == 'QUERY') { %><%= requestparamsVariableIdentifier %><% } %>, x, RequestMethod.<%= actiontype.toUpperCase() %>, RequestType.Fehler, nextAction, error);
                        return of(nextAction);
                    });
        })
    );

    constructor(
        private actions$: Actions,
        private injector: Injector,
        private ngrxManagerService: NgrxManagerService) {
    }
<% } else { %>
    @Injectable()
    export class <%= classify(clientname) %><%= classify(methodWithoutType) %>Effects  {

        private service : api.<%= classify(service) %>Service = null;
        private getService() : api.<%= classify(service) %>Service {
                if (this.service === null) {
                    this.service = this.injector.get(api.<%= classify(service) %>Service);
                }
                return this.service;
            }

        @Effect()
            <%= classify(methodWithoutType) %>$: Observable<Action> = this.actions$.pipe(
                ofType(ac.<%= underscore(classify(method)).toUpperCase() %>),
                flatMap((x: ac.<%= classify(method) %>Action) => {
                const optPayload = (x !== undefined && x !== null && x.optPayload !== undefined) ? x.optPayload : null;
                return this.getService().<%= method %>(<%= requestparamsVariableNames %>)
                    .map((result: any) => {
                        const nextAction = new ac.<%= classify(method) %>ErfolgreichAction(<% if(responseparamsVariableNames!='') {%>result<% } %><% if (responseparamsVariableNames!='') {%>, <% } %><%= requestparamsVariableNames %><% if (requestparamsVariableNames!='') {%>, <% } %> optPayload);
                        return nextAction;
                    })
                    .catch((error: any) => {
                        const nextAction = new ac.<%= classify(method) %>FehlerAction(error, <%= requestparamsVariableNames %><% if (requestparamsVariableNames!='') {%>, <% } %> optPayload);
                        return of(nextAction);
                    });
            })
        );

        constructor(
            private actions$: Actions,
            private injector: Injector) {
        }
        <% } %>
}
