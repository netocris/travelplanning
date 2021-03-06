import { Component, Inject, LOCALE_ID } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { IUser } from '../../../models/i-user';
import { BaseComponent } from '../../base.component';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent extends BaseComponent {
    
  private currentUser: IUser;
  isLoggedIn: boolean = false;

  constructor(private authService: AuthService, private router: Router,
    @Inject(LOCALE_ID) protected lang: string) {
      super();      
     }
  
  protected ngOnInitCustom(): void {
    this.authService.user.subscribe(user => {      
      this.isLoggedIn = false;
      this.currentUser = null;
      if (user) {
        this.isLoggedIn = true;
        this.currentUser = user;        
      }
      this.router.navigate(['/dashboard']);
    });
  }
  
  login(): void {
    this.authService.signIn();
  }

  logout(): void {
    this.authService.signOut();    
  }

  getUserDisplayName(): string {
    if (this.currentUser) {
      return this.currentUser.displayName ? this.currentUser.displayName : this.currentUser.email;
    } else {
      return '';
    }
  }

  getUserPhoto(): string {
    if (this.currentUser) {
      return this.currentUser.photoURL ? this.currentUser.photoURL : '/assets/images/neutral-user.png';
    } else {
      return '/assets/images/neutral-user.png';
    }
  }

}
