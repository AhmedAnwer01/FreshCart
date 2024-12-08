import { Component, inject } from '@angular/core';
import { NavBlankComponent } from "../nav-blank/nav-blank.component";
import { FooterComponent } from "../footer/footer.component";
import { AuthenticationService } from '../../core/services/authentication.service';
import { NavAuthComponent } from "../nav-auth/nav-auth.component";

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [NavBlankComponent, FooterComponent, NavAuthComponent],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent {


  private readonly _AuthenticationService = inject(AuthenticationService)
  logged !: boolean
  ngOnInit(): void {
    if (this._AuthenticationService.userData) {
      this.logged = true
    } else {
      this.logged = false
    }
  }
}
