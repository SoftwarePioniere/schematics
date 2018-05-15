import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/takeUntil';
import { Injectable, InjectionToken, Optional, Inject } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Database } from '@ngrx/db';
import { defer } from 'rxjs/observable/defer';
import { Store } from '@ngrx/store';

import * as ac from './actions.<%= actiontype %>.<%= dasherize(methodWithoutType) %>';
import * as api from '<%= importpath %>clients/<%= clientname %>';
import { CommunicationService } from '<%= importpath %>sopi/providers/communication.service';


@Injectable()
export class <%= classify(clientname) %>Modul<%= classify(methodWithoutType) %><%= classify(methodWithoutType) %>Effects  {
@Effect()
    <%= classify(methodWithoutType) %>$: Observable<Action> = this.actions$
        .ofType(ac.<%= underscore(classify(methodWithoutType)).toUpperCase() %>)
        .switchMap((x: ac.<%= classify(methodWithoutType) %>Action) => {
            return this._<%= clientname %><%= classify(actiontype) %>Service.<%= method %>(<%= requestparamsVariableNames %>)
                .map((result:any) => {
                    this._communicationService.requestSucceded(result,<% if (requestparamsVariableNamesSucceed !='') {%><%= requestparamsVariableNamesSucceed %><% }else{ %> null <% } %>);
                    return new ac.<%= classify(methodWithoutType) %>ErfolgreichAction(<% if(responseparamsVariableNames!='') {%>result<% } %><% if (requestparamsVariableNames !='' && responseparamsVariableNames!='') {%>, <% } %><%= requestparamsVariableNames %>);
                })
                .catch((error:any) => {
                    this._communicationService.requestError(error<% if (requestparamsVariableNamesSucceed !='') {%>, <% } %><%= requestparamsVariableNamesSucceed %>);
                    return of(new ac.<%= classify(methodWithoutType) %>FehlerAction(error<% if (requestparamsVariableNames !='') {%>, <% } %> <%= requestparamsVariableNames %>));
                })
        });

    constructor(
        private actions$: Actions,
        private _<%= clientname %><%= classify(actiontype) %>Service: api.<%= classify(clientname) %><%= classify(actiontype) %>Service,
        private _communicationService: CommunicationService) {
    }
}


/*
1 <%= requestparams %>
2 <%= responseparams %>
3 <%= requestparamsVariableNames %>
4 <%= requestparamsVariableNamesSucceed %>
5 <%= responseparamsVariableNames %>
*/