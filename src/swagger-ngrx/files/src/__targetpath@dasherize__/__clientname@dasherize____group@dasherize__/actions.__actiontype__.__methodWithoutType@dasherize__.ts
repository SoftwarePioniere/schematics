<% if (apiIsUsed !='') {%>import * as api from '<%= importpath %>clients/<%= clientname %>'; <% } %>
<% if (useNgrxManager) {%>import {NgrxManagerAction, NgrxManagerConfig} from '@softwarepioniere/ngrx-manager';<% } %>
<% if (!useNgrxManager) {%>import {Action} from '@ngrx/store';<% } %>

export const <%= underscore(classify(method)).toUpperCase() %> = '[<%= classify(clientname) %>Modul] <%= classify(method) %> laden';
export const <%= underscore(classify(method)).toUpperCase() %>_ERFOLGREICH = '[<%= classify(clientname) %>Modul] <%= classify(method) %> laden erfolgreich';
export const <%= underscore(classify(method)).toUpperCase() %>_FEHLER = '[<%= classify(clientname) %>Modul] <%= classify(method) %> Ladefehler';


<% if (useNgrxManager) {%>
export class <%= classify(method) %>Action implements NgrxManagerAction {
    readonly type = <%= underscore(classify(method)).toUpperCase() %>;
    constructor(<%= requestparams %><% if (requestparams !='') {%>, <% } %><%= optPayload %>, public ngrxManager: NgrxManagerConfig = null) {}
    }
export class <%= classify(method) %>ErfolgreichAction implements NgrxManagerAction {
    readonly type = <%= underscore(classify(method)).toUpperCase() %>_ERFOLGREICH;
    constructor(<%= responseparams %><% if (responseparams!='' && requestparams !='') {%>, <% } %><%= requestparams %><% if (responseparams !='') {%>, <% } %><%= optPayload %>, public ngrxManager: NgrxManagerConfig = null) {}
    }
export class <%= classify(method) %>FehlerAction implements NgrxManagerAction {
    readonly type = <%= underscore(classify(method)).toUpperCase() %>_FEHLER;
    constructor(public payload: any<% if (requestparams !='') {%>, <% } %><%= requestparams %>, <%= optPayload %>, public ngrxManager: NgrxManagerConfig = null) {}
    }
    <%
} else {
    %>
export class <%= classify(method) %>Action implements Action {
    readonly type = <%= underscore(classify(method)).toUpperCase() %>;
        constructor(<%= requestparams %><% if (requestparams !='') {%>, <% } %><%= optPayload %>) {}
    }
export class <%= classify(method) %>ErfolgreichAction implements Action {
    readonly type = <%= underscore(classify(method)).toUpperCase() %>_ERFOLGREICH;
        constructor(<%= responseparams %><% if (responseparams!='' && requestparams !='') {%>, <% } %><%= requestparams %><% if (responseparams !='') {%>, <% } %><%= optPayload %>) {}
    }
export class <%= classify(method) %>FehlerAction implements Action {
    readonly type = <%= underscore(classify(method)).toUpperCase() %>_FEHLER;
        constructor(public payload: any<% if (requestparams !='') {%>, <% } %><%= requestparams %>, <%= optPayload %>) {}
    }
    <% } %>

export type <%= classify(clientname) %><%= classify(actiontype) %><%= classify(methodWithoutType) %>Actions =
    <%= classify(method) %>Action
    | <%= classify(method) %>ErfolgreichAction
    | <%= classify(method) %>FehlerAction
    ;
