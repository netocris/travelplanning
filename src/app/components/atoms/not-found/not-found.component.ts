import { Component } from '@angular/core';
import { BaseComponent } from '../../base.component';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent extends BaseComponent {

  constructor() {
    super();
  }

}
