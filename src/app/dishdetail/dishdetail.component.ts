import { Component, OnInit } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';

import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

  dish: Dish;
  dishIDs: string[];
  prev: string;
  next: string;

  constructor(private dishService: DishService,
    private route: ActivatedRoute,
    private location: Location) { }

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
        this.setPrevNext(dish.id)
      });
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
