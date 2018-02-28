import {
    Rule,
    apply,
    chain,
    mergeWith,
    // externalSchematic,
    template,
    url,
} from '@angular-devkit/schematics';
import {
    // normalize,
    strings
} from '@angular-devkit/core';

export default function (options: any): Rule {
    options.ClassName = options.name.substring(0, 1).toLocaleUpperCase() + options.name.substring(1);

    // let ngrxOptions = {
    //     name: options.name,
    //     path: normalize('pages/' + strings.dasherize(options.name)),
    //     module: strings.dasherize(options.name) + "-loeschen.modal.module.ts",
    //     flat: true,
    //     feature: true
    // };

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

        // externalSchematic('@ngrx/schematics', 'feature', ngrxOptions),
        // externalSchematic('@ngrx/schematics', 'action', ngrxOptions),
        // externalSchematic('@ngrx/schematics', 'reducer', ngrxOptions),
        // externalSchematic('@ngrx/schematics', 'effect', ngrxOptions),
        // externalSchematic('@ngrx/schematics', 'store', ngrxOptions)
    ]);
}
