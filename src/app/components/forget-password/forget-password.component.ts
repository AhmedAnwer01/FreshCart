import { isPlatformBrowser, NgClass } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RxFormBuilder, RxReactiveFormsModule, RxwebValidators } from '@rxweb/reactive-form-validators';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../core/services/authentication.service';
import { IResetCode } from '../../core/interfaces/forgotPassword/ireset-code';
import { IResetPassword } from '../../core/interfaces/forgotPassword/ireset-password';
import { IRecoveryEmail } from '../../core/interfaces/forgotPassword/irecovery-email';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';
import { NgxTranslateService } from '../../core/services/ngxtranslate.service';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, RxReactiveFormsModule, RouterLink, TranslateModule],

  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'
})
export class ForgetPasswordComponent {
  private readonly _RxFormBuilder = inject(RxFormBuilder)
  private readonly _Router = inject(Router)
  private readonly _AuthenticationService = inject(AuthenticationService)
  private readonly _ToastrService = inject(ToastrService)
  private readonly _NgxTranslateService = inject(NgxTranslateService)
  private readonly _PLATFORM_ID = inject(PLATFORM_ID)


  // Component Properties

  showPassword: boolean = false;
  passwordType: "password" | "text" = "password"
  msgError: string = ""
  msgSuc: string = ""
  isLoading: boolean = false
  submitDisabled: boolean = false
  step: number = 1
  resetCode !: IResetCode

  resetPasswordData: IResetPassword = {} as IResetPassword
  newToken !: string
  userEmail !: IRecoveryEmail
  dir !: string


  // Subscriptions 

  forgotPasswordSubscribe !: Subscription
  newPasswordValueChangesSubscribe !: Subscription | undefined
  emailValueChangesSubscribe !: Subscription | undefined
  codeValueChangesSubscribe !: Subscription | undefined
  resetPasswordSubscribe !: Subscription | undefined


  ngDoCheck(): void {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      this.dir = document.documentElement.dir
    }
  }
  // Activate Submit Button on Input Change
  emailChanged() {
    this.emailValueChangesSubscribe = this.verifyEmailForm.get("email")?.valueChanges.subscribe({
      next: () => {
        if (this.msgError == "Email is not registered") {
          this.msgError = ""
          this.msgSuc = ""
          this.submitDisabled = false
        }
      }
    })
  }
  codeChanged() {
    this.codeValueChangesSubscribe = this.verifyCodeForm.get("resetCode")?.valueChanges.subscribe({
      next: () => {
        if (this.msgError == "code is not correct" || this.verifyCodeForm.valid) {
          this.msgError = ""
          this.msgSuc = ""
          this.submitDisabled = false
        }
      }
    })
  }
  newPasswordChanged() {
    this.newPasswordValueChangesSubscribe = this.resetPasswordForm.get("newPassword")?.valueChanges.subscribe({
      next: () => {
        if (this.msgError == "Incorrect password") {
          this.msgError = ""
          this.msgSuc = ""
          this.submitDisabled = false
        }
      }
    })
  }


  // Forgot password Forms Validations using RXValidators 

  verifyEmailForm: FormGroup = this._RxFormBuilder.group({
    email: ['', [RxwebValidators.required(), RxwebValidators.email()]],
  });

  verifyCodeForm: FormGroup = this._RxFormBuilder.group({
    resetCode: ['', [RxwebValidators.required(), RxwebValidators.pattern({ expression: { 'OTPCode': /^\d{5}$/ } })]],
  });

  resetPasswordForm: FormGroup = this._RxFormBuilder.group({
    email: ['', [RxwebValidators.required(), RxwebValidators.email()]],
    newPassword: ['', [RxwebValidators.required(), RxwebValidators.password({ validation: { maxLength: 30, minLength: 6 } })]],
  });


  // On Submit Function For Each Form

  verifyEmail(): void {
    if (this.verifyEmailForm.valid) {

      this.userEmail = this.verifyEmailForm.get("email")?.value
      this.resetPasswordForm.get("email")?.patchValue(this.userEmail)

      this.isLoading = true
      this.forgotPasswordSubscribe = this._AuthenticationService.forgotPassword(this.userEmail).subscribe({
        next: (res) => {
          // console.log(res);
          this.msgSuc = "Verification Code is Sent to Your Email"
          this._ToastrService.success(this.msgSuc, "FreshCart")
          this.isLoading = false
          this.step = 2
          this.submitDisabled = false
        },
        error: (err) => {
          if (err.error.message == "Email is not registered")
            this.submitDisabled = false
          this.isLoading = false
          this.step = 2
        }
      })

    }
  }


  verifyResetCode(): void {

    if (this.verifyCodeForm.valid) {
      this.isLoading = true
      this.submitDisabled = true
      this.resetCode = this.verifyCodeForm.get("resetCode")?.value;
      this.forgotPasswordSubscribe = this._AuthenticationService.verifyResetCode(this.resetCode).subscribe({
        next: (res) => {
          console.log(res);
          this.isLoading = false
          this.submitDisabled = false
          this.step = 3

        },
        error: (err) => {
          this.isLoading = false
          this.step = 3
        }
      })

    }
  }


  resetPassword(): void {

    this.resetPasswordData.email = this.resetPasswordForm.get("email")?.value
    this.resetPasswordData.newPassword = this.resetPasswordForm.get("newPassword")?.value
    this.resetPasswordSubscribe = this._AuthenticationService.resetPassword(this.resetPasswordData).subscribe({
      next: (res) => {

        // console.log(res);
        this.newToken = res.token
        localStorage.setItem("userToken", this.newToken)
        this._AuthenticationService.saveUserData()

        this.isLoading = false
        this._Router.navigate(["/home"])

      }, error: (err) => {
        this.isLoading = false

        // localStorage.setItem("userToken", this.newToken)
        // this._AuthenticationService.saveUserData()
        this._Router.navigate(["/home"])

      }
    })
  }



  // Toggle Show Password Function

  toggleShowPassword() {
    if (this.showPassword == false) {
      this.showPassword = true
      this.passwordType = "text"
    } else {
      this.showPassword = false
      this.passwordType = "password"
    }
  }

  backStep() {
    this.step--;
  }
  // Unsubscribe From All Observables

  ngOnDestroy(): void {
    this.codeValueChangesSubscribe?.unsubscribe()
    this.emailValueChangesSubscribe?.unsubscribe()
    this.forgotPasswordSubscribe?.unsubscribe()
    this.resetPasswordSubscribe?.unsubscribe()
    this.newPasswordValueChangesSubscribe?.unsubscribe()
  }
}
