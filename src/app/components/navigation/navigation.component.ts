import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  title = 'Vegetarian Recipes';

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

}
