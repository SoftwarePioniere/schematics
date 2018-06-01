# HOW TO USE

### Installation

Run

```
npm i @ngrx/store --save
npm i @ngrx/effects --save
npm i @angular-devkit/schematics --save
npm i @softwarepioniere/schematics --save
```

## Style Variables

Add the following variables to /src/theme/variables.scss

```
$label-farbe: #999999;
$hintergrund-von: #2b2b2b;
$hintergrund-bis: #1a1a1a;
$hintergrund-divider: #1a1a1a;
$vordergrund-divider: $label-farbe;
$trennerFarbe: #444444;
$button-background: #283440;

$positiv: #488800;
$warnung: yellow;
$negativ: #f53d3d;

// IONIC-Variablen
$fab-size: 70px;
$fab-mini-size: 60px;
$fab-list-button-background-color: $button-background;

$modal-inset-width: 90%;
$modal-inset-min-width: 768px;

$modal-inset-height-small: 500px;
$modal-inset-height-large: 90%;
```


### USE DialogModal

Run 

```
schematics @softwarepioniere/schematics:modal-dialog --name loeschen
```

Add new page/modal in src/app/app.module.ts at section *imports*

```

imports: [
        ...
        LoeschenModalModule
        ...

        ]
```

Call the modal.

```

let params = {
    titel: "ACHTUNG",
    untertitel: "Benutzer Mustermann löschen?",
    hinweistext: [
            'Soll der Benutzer tatsächlich gelöscht werden?', 
            'Durch das Löschen des Benutzers wird er nicht mehr in der Anzeige erscheinen.'
        ],
    icon: 'warning',
    iconClass: 'meldungsicon warnung',
    abbrechenButton: "Abbrechen",
    okButton: "Benutzer löschen"
};

let modal = this.modalCtrl.create(LoeschenModal, params);
modal.onDidDismiss(data => {
    if (data != null) {
        // User clicked ok
    }
});

modal.present();
        
```


### USE AuswahlModal

Run 

```
schematics @softwarepioniere/schematics:modal-auswahl --name pagename --titel modaltitel
```

Add new page/modal in src/app/app.module.ts at section *imports*

```

imports: [
        ...
        PagenameAuswahlModalModule
        ...

        ]
```

Call the modal.

```

let actionBenutzerladen = new actionsBenutzerverwaltungQuery.BenutzerLadenAction();

let params = {
    titel: "Benutzerauswahl",
    untertitel: "Benutzer für anzeige auswählen",
    keineDatenInfotext: "Es wurden keine Benutzer gefunden",
    objektEigenschaft: "titel",
    nichtAnzuzeigendeObjekte: [],
    nichtAnzuzeigendeObjektEigenschaft: "id",
    action : actionBenutzerladen,
    actionLaden : actionsBenutzerverwaltungQuery.BENUTZER_LADEN,
    actionGeladen : actionsBenutzerverwaltungQuery.BENUTZER_LADEN_ERFOLGREICH,
    actionFehler : actionsBenutzerverwaltungQuery.BENUTZER_LADEN_FEHLER
};

let modal = this.modalCtrl.create(AutoAuswahlModal, params);
modal.onDidDismiss(data => {
    if (data != null) {
        // Run your commands
    }
});

modal.present();
        
```




# Schematics development

This repository is a basic Schematic implementation that serves as a starting point to create and publish Schematics to NPM.

### Testing

To test locally, install `@angular-devkit/schematics` globally and use the `schematics` command line tool. That tool acts the same as the `generate` command of the Angular CLI, but also has a debug mode.

Check the documentation with
```bash
schematics --help
```

### Unit Testing

`npm run test` will run the unit tests, using Jasmine as a runner and test framework.

### Publishing

To publish, simply do:

```bash
git add .
git commit -m "clean up"
git push
npm version [<newversion> | major | minor | patch | premajor | preminor | prepatch | prerelease | from-git]
npm run build
npm publish
```

That's it!
 
### CHANGE
After add, remove or update a schematic, you must first run 

```
npm run build 
```

at root path.
 
### RUN

Run in debug mode
```
schematics .:page --name=test
```

Run without debug mode
```
schematics .:page --name=test --debug=false
```

### SCHEMATICS`
```
schematics .:modal-loeschen --name=xxx --titel=xxx --debug=false
```





# Swagger Clients

### CONFIG
swagger-sources.json 
````json
[
  {
    "name": "clientname1",
    "url": "https://xyz.com/swagger/client1/swagger.json"
  },
  {
    "name": "clientname1",
    "url": "https://xyz.com/swagger/client2/swagger.json"
  }
]
````

### RUN
```
node node_modules/@softwarepioniere/schematics/gen.js @softwarepioniere/schematics swagger-sources.json
```

### RUN DEV
```
node gen.js .
```


# Generate Actions

/src/pages/pagename/actions.ui.json 
````json
{
  "imports": [
      "import {Action} from '@ngrx/store';",
      "import {Action} from '@ngrx/db';"
  ],
  "actions": [
    {
      "page": "AufgabePage",
      "action": "PageStateReset",
      "payload": "",
      "description": ""
    },
    {
      "page": "AufgabePage",
      "action": "IgnoreWS",
      "payload": "public payload: any",
      "description": "WS Action ignoriert"
    },
    {
      "page": "AufgabePage",
      "action": "AufgabeNichtOkGemeldet",
      "payload": "",
      "description": "Aufgabe nicht OK"
    }
  ]
}
````

### RUN
search for all actions.ui.json and generate actions for it
```
node node_modules/@softwarepioniere/schematics/genUi.js
```
or generate actions for a single page with
```
schematics @softwarepioniere/schematics:ui-actions --sourcepath=src/pages --debug=false
```

### RUN DEV
```
node genUi.js .
```
or
```
schematics .:ui-actions --sourcepath=src/pages --debug=false
```


# Generate Const File

Generate a file with constants under specified namespace.


### RUN
```
schematics @softwarepioniere/schematics:generate-const --targetpath=folder/ --namespace=BlaEntityTypes --constants=ConstString1,ConstString2.value1,ConstString2.value2 --debug=false

RESULT
File folder/bla-entity-types.constants.ts with content:

export namespace BlaEntityTypes {
    export const CONSTSTRING1 = 'ConstString1';
    export const CONSTSTRING2_VALUE1 = 'ConstString2.value2';
    export const CONSTSTRING2_VALUE2 = 'ConstString2.value2';
    }
```

### RUN DEV
```
schematics .:generate-const --targetpath=folder/ --namespace=BlaEntityTypes --constants=ConstString1,ConstString2.value1,ConstString2.value2 --debug=false

RESULT
File folder/bla-entity-types.constants.ts with content:

export namespace BlaEntityTypes {
    export const CONSTSTRING1 = 'ConstString1';
    export const CONSTSTRING2_VALUE1 = 'ConstString2.value2';
    export const CONSTSTRING2_VALUE2 = 'ConstString2.value2';
    }
```
