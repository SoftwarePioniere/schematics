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
    private iconName: string = "warning";
    private iconClass: string = "meldungsicon warnung";
    private abbrechenButtonClass: string = "";
    private okButtonClass: string = "";

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private viewCtrl: ViewController) {
        this.titel = this.navParams.get('titel');
        this.untertitel = this.navParams.get('untertitel');
        this.hinweistext = this.navParams.get('hinweistext');
        this.abbrechenButton = this.navParams.get('abbrechenButton');
        this.okButton = this.navParams.get('okButton');
        this.iconName = (this.navParams.get('iconName') !=null ) ? this.navParams.get('iconName') : this.iconName;
        this.iconClass = (this.navParams.get('iconClass') !=null ) ? this.navParams.get('iconClass') : this.iconClass;
        this.abbrechenButtonClass = (this.navParams.get('abbrechenButtonClass') !=null ) ? this.navParams.get('abbrechenButtonClass') : this.abbrechenButtonClass;
        this.okButtonClass = (this.navParams.get('okButtonClass') !=null ) ? this.navParams.get('okButtonClass') : this.okButtonClass;
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
