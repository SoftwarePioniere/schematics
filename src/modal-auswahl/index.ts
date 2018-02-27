import {
    Rule,
    apply,
    chain,
    mergeWith,
    template,
    url,
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';

export default function (options: any): Rule {
    options.ClassName = options.name.substring(0, 1).toLocaleUpperCase() + options.name.substring(1);

    return chain([
        mergeWith(apply(url('./files'), [
            template({
                classify: strings.classify,
                dasherize: strings.dasherize,
                titel: options.titel,
                INDEX: options.index,
                name: options.name,
                path: options.name.toLowerCase()
            }),
        ])),
    ]);
}
