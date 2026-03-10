import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { AddQuestionModalComponent } from './add-question-modal/add-question-modal.component';
import { Observable } from 'rxjs';
import { Question } from '../models/question.model';
import { FirebaseService } from '../services/firebase.service';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: false,
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {

  questions$: Observable<Question[]>;
  isLoading = false;

  constructor(private modalController: ModalController, private firebaseService: FirebaseService, private authService: AuthService, private alertCtrl: AlertController) {
    this.questions$ = this.firebaseService.questions;
  }

  ngOnInit() {
    this.loadQuestions();
  }

  loadQuestions(){
    this.isLoading = true;
    this.firebaseService.getQuestions().subscribe({
      next: () => {
        console.log('Questions are loaded!');
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error while loading questions!', err);
        this.isLoading = false;
      },
    });
  }

  async openAddQuestionModal(){
    const modal = await this.modalController.create({
      component: AddQuestionModalComponent,
      cssClass: 'add-question-modal',
    });
    await modal.present();
  }

  async onDeleteQuestion(id: string, questionText: string){
    const alert = await this.alertCtrl.create({
      header: 'Delete Question',
      message: `Are you sure you want to delete: "${questionText}"?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.firebaseService.deleteQuestion(id).subscribe({
              next: () => {
                console.log('Question deleted!');
              },
              error: (err) => {
                console.log('Error while deleting!', err);
              },
            });
          },
        },
      ],
    });

    await alert.present();
  }

  async onEditQuestion(question: Question){
    const modal = await this.modalController.create({
      component: AddQuestionModalComponent,
      cssClass: 'add-question-modal',
      componentProps: {
        question: question
      }
    });

    await modal.present();
  }
}
