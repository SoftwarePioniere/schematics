import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { <%= classify(name) %>Modal } from './<%= dasherize(name) %>.modal';

@NgModule({
  declarations: [
      <%= classify(name) %>Modal,
  ],
  imports: [
    IonicPageModule.forChild(<%= classify(name) %>Modal),
  ],
})
export class <%= classify(name) %>ModalModule {}
