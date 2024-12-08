import { IloginForm } from './../../core/interfaces/Ilogin-form';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Component, inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { AuthenticationService } from '../../core/services/authentication.service';
import { HttpErrorResponse } from '@angular/common/http';
import { isPlatformBrowser, NgClass } from '@angular/common';
import { ISuccessMsg } from '../../core/interfaces/isuccess-msg';
import { RxFormBuilder, RxReactiveFormsModule, RxwebValidators } from '@rxweb/reactive-form-validators';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxTranslateService } from '../../core/services/ngxtranslate.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, TranslateModule, RxReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnDestroy {

  private readonly _AuthService = inject(AuthenticationService)
  private readonly _RxFormBuilder = inject(RxFormBuilder)
  private readonly _Router = inject(Router)
  private readonly _ToastrService = inject(ToastrService)
  private readonly _TranslateService = inject(TranslateService)
  private readonly _NgxTranslateService = inject(NgxTranslateService)
  private readonly _PLATFORM_ID = inject(PLATFORM_ID)



  loginTemplate!: IloginForm;
  responseMsg !: ISuccessMsg
  showPassword: boolean = false;
  passwordType: "password" | "text" = "password"
  msgError: string = ""
  msgSuc: string = ""
  isLoading: boolean = false
  submitDisabled: boolean = false
  dir !: string


  passwordValueChangesSubscribe !: Subscription | undefined
  emailValueChangesSubscribe !: Subscription | undefined
  signInSubscribe !: Subscription


  ngDoCheck(): void {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      this.dir = document.documentElement.dir
    }
  }

  loginForm: FormGroup = this._RxFormBuilder.group({
    email: ['', [RxwebValidators.required(), RxwebValidators.email()]],
    password: ['', [RxwebValidators.required(), RxwebValidators.password({ validation: { maxLength: 30, minLength: 6 } })]],
  });

  passwordChanged() {
    this.passwordValueChangesSubscribe = this.loginForm.get("password")?.valueChanges.subscribe({
      next: () => {
        if (this.msgError == "Incorrect email or password") {
          this.msgError = ""
          this.msgSuc = ""
          this.submitDisabled = false
        }
      }
    })
  }

  emailChanged() {
    this.emailValueChangesSubscribe = this.loginForm.get("email")?.valueChanges.subscribe({
      next: () => {
        if (this.msgError == "Incorrect email or password") {
          this.msgError = ""
          this.msgSuc = ""
          this.submitDisabled = false
        }
      }
    })
  }
  loginSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true

      this.loginTemplate = this.loginForm.value

      this.signInSubscribe = this._AuthService.signIn(this.loginTemplate).subscribe({
        next: (res) => {
          // console.log(res);

          this.isLoading = false
          this.submitDisabled = false
          if (res.message.toLowerCase() === "success") {
            this.msgSuc = this._TranslateService.instant("success.loginSuccess")
            this._ToastrService.success(this.msgSuc, "FreshCart")


            localStorage.setItem("userToken", res.token)

            this._AuthService.saveUserData()

            this._Router.navigate(['/home']);

          }
        },

      })

    }
  }


  toggleShowPassword() {
    if (this.showPassword == false) {
      this.showPassword = true
      this.passwordType = "text"
    } else {
      this.showPassword = false
      this.passwordType = "password"
    }
  }

  ngOnDestroy(): void {
    this.signInSubscribe?.unsubscribe()
    this.passwordValueChangesSubscribe?.unsubscribe()
    this.emailValueChangesSubscribe?.unsubscribe()
  }
}

