export namespace <%= namespace %> {
    <% for(const x of constants) { %>export const <%= x.toUpperCase().replace(/./gi,'_',) %> = '<%= x %>';
    <% } %>}

