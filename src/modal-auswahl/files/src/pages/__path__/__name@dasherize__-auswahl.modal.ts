import {Component, ViewChild} from '@angular/core';
import {Content, IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {Store} from "@ngrx/store";
import {Observable} from "rxjs/Observable";

import * as actionsUi from './actions.ui';
import * as from<%= classify(name) %>AuswahlModal from './reducer';
import {CheckboxWrapper, DividerGroup, IndexWrapper} from "./reducer";

/**
 * Generated class for the <%= classify(name) %>AuswahlModal page.
 */

let actionApi = {
    action: null,
    actionLaden: "",
    actionGeladen: "",
    actionFehler: ""
};

@IonicPage()
@Component({
    selector: 'page-<%= dasherize(name) %>-auswahl',
    templateUrl: '<%= dasherize(name) %>-auswahl.modal.html',
})
export class <%= classify(name) %>AuswahlModal {
    @ViewChild(Content) content: Content;

    private gruppiert$: Observable<DividerGroup[]>;
    private uiLadeanimation$: Observable<boolean>;
    private uiLadeFehler$: Observable<boolean>;
    private uiIndex$: Observable<IndexWrapper[]>;
    private filterString: string = "";

    private titel: string = "";
    private aktuell: Array<any>;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private viewCtrl: ViewController,
                private _store: Store<from<%= classify(name) %>AuswahlModal.PageState>) {
        this.aktuell = this.navParams.get('aktuell');
        this.titel = this.navParams.get('titel');
        actionApi.action = this.navParams.get('action');
        actionApi.actionLaden = this.navParams.get('actionLaden');
        actionApi.actionGeladen = this.navParams.get('actionGeladen');
        actionApi.actionFehler = this.navParams.get('actionFehler');
    }

    ionViewDidLoad() {
        this._log.logVerbose('ionViewDidLoad <%= classify(name) %>AuswahlModal');
        this._store.dispatch(new actionsUi.PageStateResetAction());
        this._store.dispatch(new actionsUi.NichtAnzuzeigendeItemsSetzenAction(this.aktuell));

        this.gruppiert$ = this._store.select(from<%= classify(name) %>AuswahlModal.getGruppiert);
        this.uiLadeanimation$ = this._store.select(from<%= classify(name) %>AuswahlModal.getUiLadeanimation);
        this.uiLadeFehler$ = this._store.select(from<%= classify(name) %>AuswahlModal.getUiLadeFehler);
        this.uiIndex$ = this._store.select(from<%= classify(name) %>AuswahlModal.getUiIndex);

        this.datenLaden();
    }

    ok() {
        this._store.select(from<%= classify(name) %>AuswahlModal.getItems).subscribe(item => {
            let ausgewaehlteItems = item.filter(x => x.selected ==true).map(x=>x.item);
            let data = {"hinzugefuegte": ausgewaehlteItems, "entfernte": []};
            this.viewCtrl.dismiss(data);
        });
    }

    abbrechen() {
        this.viewCtrl.dismiss();
    }

    scrollTo(elementId) {
        let yOffset = document.getElementById(elementId).offsetTop;
        this.content.scrollTo(0, yOffset, 1000)
    }

    datenLaden() {
        this._store.dispatch(actionApi.action);
    }

    suchen(filterString: string) {
        this._store.dispatch(new actionsUi.ItemSuchenAction(filterString));
    }

    auswahl(item: CheckboxWrapper) {
        if (item.selected) {
            this._store.dispatch(new actionsUi.ItemAktiviertAction(item));
        } else {
            this._store.dispatch(new actionsUi.ItemDeaktiviertAction(item));
        }
    }
}
