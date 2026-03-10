import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Question } from 'src/app/models/question.model';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  standalone: false,
  selector: 'app-add-question-modal',
  templateUrl: './add-question-modal.component.html',
  styleUrls: ['./add-question-modal.component.scss'],
})
export class AddQuestionModalComponent implements OnInit{

  @Input() question?: Question;

  questionText: string = '';
  answer1: string = '';
  answer2: string = '';
  answer3: string = '';
  answer4: string = '';
  answer5: string = '';
  isLoading = false;
  isEditing = false;
  questionId: string = '';

  constructor(private modalController: ModalController, private authService: AuthService, private firebaseService: FirebaseService) { }

  ngOnInit(){
    if(this.question){
      this.populateForm(this.question);
    }
  }

  populateForm(question: Question){
    this.isEditing = true;
    this.questionId = question.id;
    this.questionText = question.questionText;
    this.answer1 = question.answers[0] || '';
    this.answer2 = question.answers[1] || '';
    this.answer3 = question.answers[2] || '';
    this.answer4 = question.answers[3] || '';
    this.answer5 = question.answers[4] || '';
  }

  dismiss(){
    this.modalController.dismiss();
  }

  save(){
    if(!this.questionText || !this.answer1 || !this.answer2 || !this.answer3 || !this.answer4 || !this.answer5){
      console.log('All fields are required!');
      return;
    }

    this.isLoading = true;
    const answers = [this.answer1, this.answer2, this.answer3, this.answer4, this.answer5];
    const createdBy = this.authService.getUserId() || 'admin';

    if(this.isEditing){
      this.firebaseService.editQuestion(this.questionId, this.questionText, answers, createdBy).subscribe({
        next: () => {
          console.log('Question is edited!');
          this.isLoading = false;
          this.modalController.dismiss();
        },
        error: (err) => {
          console.error('Error while editing question!', err);
          this.isLoading = false;
        }
      })
    }else{
      this.firebaseService.addQuestion(this.questionText, answers, createdBy).subscribe({
        next: () => {
          console.log('Question added!');
          this.isLoading = false;
          this.modalController.dismiss();
        },
        error: (err) => {
          console.error('Error while adding question!', err);
          this.isLoading = false;
        },
      });
    }
  }
}
