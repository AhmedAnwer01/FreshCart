import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Component, inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input-gg';
import { IRegisterForm } from '../../core/interfaces/Iregister-form';
import { AuthenticationService } from '../../core/services/authentication.service';
import { HttpErrorResponse } from '@angular/common/http';
import { isPlatformBrowser, NgClass } from '@angular/common';
import { RxFormBuilder, RxReactiveFormsModule, RxwebValidators } from '@rxweb/reactive-form-validators';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxTranslateService } from '../../core/services/ngxtranslate.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [NgxIntlTelInputModule, NgClass, TranslateModule, RxReactiveFormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnDestroy {

  private readonly _AuthService = inject(AuthenticationService)
  private readonly _RxFormBuilder = inject(RxFormBuilder)
  private readonly _Router = inject(Router)
  private readonly _ToastrService = inject(ToastrService)
  private readonly _NgxTranslateService = inject(NgxTranslateService)
  private readonly _TranslateService = inject(TranslateService)
  private readonly _PLATFORM_ID = inject(PLATFORM_ID)


  registerTemplate!: IRegisterForm;
  showPassword: boolean = false;
  passwordType: "password" | "text" = "password"
  msgError: string = ""
  msgSuc: string = ""
  isLoading: boolean = false
  submitDisabled: boolean = false
  phoneValueChangesSubscribe !: Subscription | undefined
  emailValueChangesSubscribe !: Subscription | undefined
  signUpSubscribe !: Subscription
  dir !: string


  ngDoCheck(): void {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      this.dir = document.documentElement.dir
    }
  }
  registerForm: FormGroup = this._RxFormBuilder.group({

    name: ['', [RxwebValidators.required(), RxwebValidators.maxLength({ value: 30 }), RxwebValidators.minLength({ value: 3 })]],
    email: ['', [RxwebValidators.required(), RxwebValidators.email()]],
    password: ['', [RxwebValidators.required(), RxwebValidators.password({ validation: { minLength: 6, maxLength: 30 } })]],
    rePassword: ['', [RxwebValidators.required(), RxwebValidators.compare({ fieldName: 'password' })]],
    phone: ['', [RxwebValidators.required()]]

  })

  // registerForm: FormGroup = new FormGroup({
  //   name: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
  //   email: new FormControl(null, [Validators.required, Validators.email]),
  //   password: new FormControl(null, [Validators.required, Validators.pattern(/^(\w|\W){6,}$/)]),
  //   rePassword: new FormControl(null, Validators.required),
  //   phone: new FormControl(null, [Validators.required])
  // }, this.confirmPassword)

  // confirmPassword(g: AbstractControl) {
  //   if (g.get("password")?.value === g.get("rePassword")?.value) {
  //     return null
  //   } else {
  //     return { mismatch: true }
  //   }
  // }
  phoneChanged() {

    this.phoneValueChangesSubscribe = this.registerForm.get("phone")?.valueChanges.subscribe({
      next: (res) => {
        if (this.msgError == "accept only egypt phone numbers") {
          this.msgError = ""
          this.msgSuc = ""
          this.submitDisabled = false
        }
      }
    })
  }

  emailChanged() {
    this.emailValueChangesSubscribe = this.registerForm.get("email")?.valueChanges.subscribe({
      next: () => {
        if (this.msgError == "Account Already Exists") {
          this.msgError = ""
          this.msgSuc = ""
          this.submitDisabled = false
        }
      }
    })
  }
  registerSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true

      this.registerTemplate = this.registerForm.value
      this.registerTemplate.phone = this.registerForm.get("phone")?.value.nationalNumber.replace(" ", "")

      this.signUpSubscribe = this._AuthService.signUp(this.registerTemplate).subscribe({
        next: (res) => {
          this.isLoading = false
          this.submitDisabled = false
          if (res.message.toLowerCase() === "success") {
            this.msgSuc = this._TranslateService.instant("success.registerSuccess")
            this._ToastrService.success(this.msgSuc, "FreshCart")
            this.msgError = ""
            setTimeout(() => {
              this._Router.navigate(['/login']);
            }, 1000);
          }

        },
        error: (err: HttpErrorResponse) => {
          this.isLoading = false
          this.msgError = err.error.errors?.msg ?? err.error.message
          if (this.msgError == "Account Already Exists" || this.msgError == "accept only egypt phone numbers") {
            this.submitDisabled = true
          }
        }
      }
      )

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
    this.signUpSubscribe?.unsubscribe();
    this.emailValueChangesSubscribe?.unsubscribe()
    this.phoneValueChangesSubscribe?.unsubscribe()
  }
}

