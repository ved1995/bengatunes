import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { NavigationComponent } from './navigation.component';
import {Router} from '@angular/router';

@Component({
    selector: 'change-password-dialog',
    templateUrl: './change-password-dialog.html'
})

export class DialogChangePassword implements OnInit {
    changePasswordForm: FormGroup;
    message: string;
    loading: boolean = false;



    constructor(
        private router:Router,
        private fomBuilder: FormBuilder,
        private api: ApiService,
        public dialogRef: MatDialogRef<NavigationComponent>
    ) { }

    ngOnInit() {
        this.changePasswordForm = this.fomBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
            newPassword: ['', Validators.required],
            confirmPassword: ['', Validators.required]
        });
    }
    cancel() {
        this.dialogRef.close();
    }

    updatePassword(event) {
        this.loading=true;
        console.log('the form values are:', event);
        console.log('the values of forms are:', this.changePasswordForm.value);
        if (this.changePasswordForm.value.newPassword != this.changePasswordForm.value.confirmPassword) {
            this.message = "password does not match";

        } else {
            this.api.updatePassword(this.changePasswordForm.value).subscribe(
                data => {
                    if (data.success) {
                        this.loading = false;
                        this.dialogRef.close();
                        this.router.navigate(['login'])
                    }else{
                        this.message=data.data;
                        this.loading=false;
                    }
                }
            );
        }
    }


}