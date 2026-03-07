import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  standalone: false,
  selector: 'app-add-question-modal',
  templateUrl: './add-question-modal.component.html',
  styleUrls: ['./add-question-modal.component.scss'],
})
export class AddQuestionModalComponent  implements OnInit {

  questionText: string = '';
  answer1: string = '';
  answer2: string = '';
  answer3: string = '';
  answer4: string = '';
  answer5: string = '';

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  dismiss(){
    this.modalController.dismiss();
  }

  save(){
    const newQuestion = {
      questionText: this.questionText,
      answers: [this.answer1, this.answer2, this.answer3, this.answer4, this.answer5],
    };

    console.log('New Question:', newQuestion);

    this.modalController.dismiss();
  }

}
