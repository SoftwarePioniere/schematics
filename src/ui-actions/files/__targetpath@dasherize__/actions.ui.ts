import {Action} from '@ngrx/store';
<% for(const x of fileContent.imports) { %><%= x %>
<% } %>
<% for(const x of fileContent.actions) { %>
export const <%= underscore(x.action).toUpperCase() %>_ACTION = '[<%= x.page %>] <% if(x.description=="") { %><%= underscore(x.action).toUpperCase() %>_ACTION<% } %><%= x.description %>';<% } %>
<% for(const x of fileContent.actions) { %>

export class <%= x.action %>Action implements Action {
    readonly type = <%= underscore(x.action).toUpperCase() %>_ACTION;

    constructor(<%= x.payload %>) {}
}
<% } %>

export type Actions =
<% for(const x of fileContent.actions) { %><% if(fileContent.actions[0]!=x){ %>| <% } %><%= x.action %>Action
    <% } %>;