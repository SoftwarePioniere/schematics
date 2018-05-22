import {Action} from '@ngrx/store';
<% if (apiIsUsed !='') {%> import * as api from '<%= importpath %>clients/<%= clientname %>'; <% } %>

export const <%= underscore(classify(methodWithoutType)).toUpperCase() %> = '[<%= classify(clientname) %>Modul] <%= classify(methodWithoutType) %> Gastrochecks';
export const <%= underscore(classify(methodWithoutType)).toUpperCase() %>_ERFOLGREICH = '[<%= classify(clientname) %>Modul] <%= classify(methodWithoutType) %> erfolgreich Gastrochecks';
export const <%= underscore(classify(methodWithoutType)).toUpperCase() %>_FEHLER = '[<%= classify(clientname) %>Modul] <%= classify(methodWithoutType) %> Fehler Gastrochecks';

export class <%= classify(methodWithoutType) %>Action implements Action {
    readonly type = <%= underscore(classify(methodWithoutType)).toUpperCase() %>;
    constructor(<%= requestparams %>) {}
    }
export class <%= classify(methodWithoutType) %>ErfolgreichAction implements Action {
    readonly type = <%= underscore(classify(methodWithoutType)).toUpperCase() %>_ERFOLGREICH;
    constructor(<%= responseparams %><% if (responseparams!='' && requestparams !='') {%>, <% } %><%= requestparams %>) {}
    }
export class <%= classify(methodWithoutType) %>FehlerAction implements Action {
    readonly type = <%= underscore(classify(methodWithoutType)).toUpperCase() %>_FEHLER;
    constructor(public payload: any<% if (requestparams !='') {%>, <% } %><%= requestparams %>) {}
    }


export type <%= classify(clientname) %><%= classify(actiontype) %><%= classify(methodWithoutType) %>Actions =
    <%= classify(methodWithoutType) %>Action
    | <%= classify(methodWithoutType) %>ErfolgreichAction
    | <%= classify(methodWithoutType) %>FehlerAction
    ;