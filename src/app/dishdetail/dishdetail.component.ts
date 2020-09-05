import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';

import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Comment } from '../shared/comment';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

  dish: Dish;
  errMess: string;
  dishIDs: string[];
  prev: string;
  next: string;
  @ViewChild('fform', { static: false })
  commentFormDirective;
  commentForm: FormGroup;
  comment: Comment;
  dishcopy: Dish;
  formErrors = {
    author: "",
    comment: "",
  };
  validationMessages = {
    'author': {
      'required': 'Author Name is required.',
      'minlength': 'Author name must be at least 2 characters long.'
    },
    'comment': {
      'required': 'Comment is required.',
    },
  }
  constructor(private dishService: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject('BaseURL') private BaseURL) {
    this.createForm();
  }

  ngOnInit() {
    this.dishService.getDishIDs()
      .subscribe((dishIds) => this.dishIDs = dishIds);

    let id = this.route.params.
      pipe(
        switchMap(
          (params: Params) => this.dishService.getDish(params['id'])
        )
      )
      .subscribe((dish) => {
        this.dish = dish;
        this.dishcopy = dish;
        this.setPrevNext(dish.id)
      },
        errmess => this.errMess = <any>errmess);
  }

  createForm() {
    this.commentForm = this.fb.group({
      author: ["", [Validators.required, Validators.minLength(2)]],
      comment: ["", [Validators.required,]],
      rating: 0,
      date: "",
    })

    this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); //to reset form validation messages
  }

  onValueChanged(data?: any) {
    if (!this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error messages (if  any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.touched && control.dirty && !control.valid) {
          const messsages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messsages[key] + " ";
            }
          }
        }
      }
    }
  }

  onSubmit() {

    this.commentForm.value["date"] = new Date();
    this.comment = this.commentForm.value;

    this.dishcopy.comments.push(this.comment);
    this.dishService.putDish(this.dishcopy)
      .subscribe(dish => {
        this.dish = dish;
        this.dishcopy = dish;
      },
        errmess => {
          this.dish = null;
          this.dishcopy = null;
          this.errMess = <any>errmess;
        })
    this.commentForm.reset({
      author: "",
      comment: "",
      date: "",
      rating: 0,
    });
    this.commentFormDirective.resetForm();
  }

  setPrevNext(dishId: string) {
    const index = this.dishIDs.indexOf(dishId);
    this.prev = this.dishIDs[(this.dishIDs.length + index - 1) % this.dishIDs.length['id']]
    this.next = this.dishIDs[(this.dishIDs.length + index + 1) % this.dishIDs.length['id']]
  }

  goBack(): void {
    this.location.back();
  }

}
