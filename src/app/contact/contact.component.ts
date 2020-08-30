import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  feedbackForm: FormGroup;
  feedback: Feedback;
  contactType = ContactType;
  @ViewChild('fform', { static: false })
  feedbackFormDirective;
  formErrors = {
    firstname: "",
    lastname: "",
    telnum: "",
    email: "",
  };

  validationMessages = {
    'firstname': {
      'required': 'First name is required.',
      'minlength': 'First name must be at least 2 characters long.',
      'maxlength': 'First name can not be 25 characters long.'
    },
    'lastname': {
      'required': 'Last name is required.',
      'minlength': 'Last name must be at least 2 characters long.',
      'maxlength': 'Last name can not be 25 characters long.'
    },
    'telnum': {
      'required': 'Tel. number is required.',
      'pattern': 'Tel. number must contain only numbers'
    },
    'email': {
      'required': 'Email is required.',
      'pattern': 'Email not in valid format.'
    }
  }
  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  ngOnInit() {
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      firstname: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      lastname: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      telnum: [0, [Validators.required, Validators.pattern]],
      email: ["", [Validators.required, Validators.email]],
      contacttype: 'None',
      message: "",
      agree: false
    })

    this.feedbackForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); //to reset form validation messages
  }

  onValueChanged(data?: any) {
    if (!this.feedbackForm) { return; }
    const form = this.feedbackForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error messages (if  any)
        this.formErrors[field] = '';
        const  control = form.get(field);
        if(control && control.dirty && !control.valid){
          const  messsages = this.validationMessages[field];
          for(const key in control.errors) {
            if(control.errors.hasOwnProperty(key)){
              this.formErrors[field] += messsages[key]+" ";
            }
          }
        }
      }
    }
  }

  onSubmit() {
    this.feedback = this.feedbackForm.value;
    this.feedbackForm.reset({
      firstname: "",
      lastname: "",
      telnum: 0,
      email: "",
      contacttype: 'None',
      message: "",
      agree: false
    });
    this.feedbackFormDirective.resetForm();
  }
}
