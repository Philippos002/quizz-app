import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddQuestionModalComponent } from './add-question-modal/add-question-modal.component';

@Component({
  standalone: false,
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {

  constructor(private modalController: ModalController) {

   }

  ngOnInit() {
  }

  async openAddQuestionModal(){
    const modal = await this.modalController.create({
      component: AddQuestionModalComponent,
      cssClass: 'add-question-modal',
    });
    return await modal.present();
  }

}
