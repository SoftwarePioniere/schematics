import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

/**
 * Generated class for the <%= classify(name) %>Modal page.
 *
 * See http://docs.softwarepioniere.de/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'modal-<%= dasherize(name) %>',
    templateUrl: '<%= dasherize(name) %>.modal.html',
})
export class <%= classify(name) %>Modal {

    private titel: string = "";
    private untertitel: string = "";
    private hinweistext: Array<string> = [];
    private abbrechenButton: string = "";
    private okButton: string = "";
    private icon: string = "warning";
    private iconClass: string = "meldungsicon warnung";

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private viewCtrl: ViewController) {
        this.titel = this.navParams.get('titel');
        this.untertitel = this.navParams.get('untertitel');
        this.hinweistext = this.navParams.get('hinweistext');
        this.abbrechenButton = this.navParams.get('abbrechenButton');
        this.okButton = this.navParams.get('okButton');
        this.icon = (this.navParams.get('icon')!=null) ? this.navParams.get('icon') : this.icon;
        this.iconClass = (this.navParams.get('iconClass')!=null) ? this.navParams.get('iconClass') : this.iconClass;
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad <%= classify(name) %>Modal');
    }


    ok() {
        this.viewCtrl.dismiss("ok");
    }

    abbrechen() {
        this.viewCtrl.dismiss();
    }

}
