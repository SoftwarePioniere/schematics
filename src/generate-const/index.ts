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
    let constants = options.constants.split(',');


    return chain([
        mergeWith(apply(url('./files'), [
            template({
                classify: strings.classify,
                dasherize: strings.dasherize,
                underscore: strings.underscore,
                titel: options.titel,
                targetpath: options.targetpath,
                namespace: options.namespace,
                constants: constants
            }),
        ])),
    ]);
}