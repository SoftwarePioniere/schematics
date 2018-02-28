# HOW TO USE

### USE LoeschenModal

Run 

```
schematics @softwarepioniere/schematics:modal-loeschen --name pagename --titel modaltitel
```

Add new page/modal in src/app/app.module.ts at section *imports*

```

imports: [
        ...
        PagenameLoeschenModalModule
        ...

        ]
```

Call the modal.

```

let params = {
    titel: "ACHTUNG",
    untertitel: "Benutzer Mustermann löschen?",
    text: [
            'Soll der Benutzer tatsächlich gelöscht werden?', 
            'Durch das Löschen des Benutzers wird er nicht mehr in der Anzeige erscheinen.'
        ],
    abbrechenButton: "Abbrechen",
    okButton: "Benutzer löschen"
};

let modal = this.modalCtrl.create(AutoAuswahlModal, params);
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
    nichtAnzuzeigendeObjektEigenschaft: "id"
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

### SCHEMATICS
schematics .:modal-loeschen --name=xxx --titel=xxx --debug=false


