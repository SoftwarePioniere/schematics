import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

/**
 * Generated class for the <%= classify(name) %>LoeschenModal page.
 *
 * See http://docs.softwarepioniere.de/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'modal-<%= dasherize(name) %>-loeschen',
    templateUrl: '<%= dasherize(name) %>-loeschen.modal.html',
})
export class <%= classify(name) %>LoeschenModal {

    private titel: string = "";
    private untertitel: string = "";
    private text: Array = [];
    private abbrechenButton: string = "";
    private okButton: string = "";

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private viewCtrl: ViewController) {
        this.titel = this.navParams.get('titel');
        this.untertitel = this.navParams.get('untertitel');
        this.text = this.navParams.get('text');
        this.abbrechenButton = this.navParams.get('abbrechenButton');
        this.okButton = this.navParams.get('okButton');
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad <%= classify(name) %>LoeschenModal');
    }


    ok() {
        this.viewCtrl.dismiss("ok");
    }

    abbrechen() {
        this.viewCtrl.dismiss();
    }

}
