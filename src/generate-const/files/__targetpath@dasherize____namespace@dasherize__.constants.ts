export namespace <%= namespace %> {
    <% for(const x of constants) { %>export const <%= x.name %> = '<%= x.value %>';
    <% } %>}

