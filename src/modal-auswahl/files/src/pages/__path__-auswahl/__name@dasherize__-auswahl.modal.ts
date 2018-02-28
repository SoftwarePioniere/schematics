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

export const <%= classify(name) %>AuswahlModalConfig = {
    action: null,
    actionLaden: "",
    actionGeladen: "",
    actionFehler: "",
    objektEigenschaft: "",
    nichtAnzuzeigendeObjekte: [],
    nichtAnzuzeigendeObjektEigenschaft: ""
};

@IonicPage()
@Component({
    selector: 'page-<%= dasherize(name) %>-auswahl',
    templateUrl: '<%= dasherize(name) %>-auswahl.modal.html',
})
export class <%= classify(name) %>AuswahlModal {
    @ViewChild(Content) content: Content;

    private itemsGruppiert$: Observable<DividerGroup[]>;
    private uiLadeanimation$: Observable<boolean>;
    private uiLadeFehler$: Observable<boolean>;
    private uiIndex$: Observable<IndexWrapper[]>;
    private filterString: string = "";

    private titel: string = "";
    private untertitel: string = "";
    private keineDatenInfotext: string = "";

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private viewCtrl: ViewController,
                private _store: Store<from<%= classify(name) %>AuswahlModal.PageState>) {
        this.titel = this.navParams.get('titel');
        this.untertitel = this.navParams.get('untertitel');
        this.keineDatenInfotext = this.navParams.get('keineDatenInfotext');

        <%= classify(name) %>AuswahlModalConfig.action = this.navParams.get('action');
        <%= classify(name) %>AuswahlModalConfig.actionLaden = this.navParams.get('actionLaden');
        <%= classify(name) %>AuswahlModalConfig.actionGeladen = this.navParams.get('actionGeladen');
        <%= classify(name) %>AuswahlModalConfig.actionFehler = this.navParams.get('actionFehler');
        <%= classify(name) %>AuswahlModalConfig.objektEigenschaft = this.navParams.get('objektEigenschaft');
        <%= classify(name) %>AuswahlModalConfig.nichtAnzuzeigendeObjekte = this.navParams.get('nichtAnzuzeigendeObjekte');
        <%= classify(name) %>AuswahlModalConfig.nichtAnzuzeigendeObjektEigenschaft = this.navParams.get('nichtAnzuzeigendeObjektEigenschaft');
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad <%= classify(name) %>AuswahlModal');
        this._store.dispatch(new actionsUi.PageStateResetAction());
        this._store.dispatch(new actionsUi.NichtAnzuzeigendeItemsSetzenAction(<%= classify(name) %>AuswahlModalConfig.nichtAnzuzeigendeObjekte));

        this.itemsGruppiert$ = this._store.select(from<%= classify(name) %>AuswahlModal.getItemsGruppiert);
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
        this._store.dispatch(<%= classify(name) %>AuswahlModalConfig.action);
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
