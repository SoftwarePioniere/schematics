import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/takeUntil';
import { Injectable } from '@angular/core';
import {Effect, Actions, ofType} from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import {switchMap} from 'rxjs/operators';

import * as ac from './actions.<%= actiontype %>.<%= dasherize(methodWithoutType) %>';
import * as api from '<%= importpath %>clients/<%= clientname %>';
import { CommunicationService } from '<%= importpath %>sopi/providers/communication.service';


@Injectable()
export class <%= classify(clientname) %><%= classify(methodWithoutType) %>Effects  {
    @Effect()
        <%= classify(methodWithoutType) %>$: Observable<Action> = this.actions$.pipe(
            ofType(ac.<%= underscore(classify(method)).toUpperCase() %>),
            switchMap((x: ac.<%= classify(method) %>Action) => {
                return this._<%= camelize(classify(service)) %>Service.<%= method %>(<%= requestparamsVariableNames %>)
                    .map((result: any) => {
                        this._communicationService.requestSucceded(result, <% if (requestparamsVariableNamesSucceed !='') {%><%= requestparamsVariableNamesSucceed %><% }else{ %> null <% } %>, x.optPayload);
                        return new ac.<%= classify(method) %>ErfolgreichAction(<% if(responseparamsVariableNames!='') {%>result<% } %><% if (requestparamsVariableNames !='' && responseparamsVariableNames!='') {%>, <% } %><%= requestparamsVariableNames %>, x.optPayload);
                    })
                    .catch((error: any) => {
                        this._communicationService.requestError(error<% if (requestparamsVariableNamesSucceed !='') {%>, <% } %><%= requestparamsVariableNamesSucceed %>, x.optPayload);
                        return of(new ac.<%= classify(method) %>FehlerAction(error<% if (requestparamsVariableNames !='') {%>, <% } %><%= requestparamsVariableNames %>, x.optPayload));
                    });
        })
    );

    constructor(
        private actions$: Actions,
        private _<%= camelize(classify(service)) %>Service: api.<%= classify(service) %>Service,
        private _communicationService: CommunicationService) {
    }
}
