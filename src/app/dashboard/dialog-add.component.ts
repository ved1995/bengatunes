import { Component, OnInit, Inject, NgModule, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from '../user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Time } from '@angular/common';
import { ApiService } from '../api.service';
import { DialogChangePassword } from '../navigation/change-password-dialog.component';

@Component({
    selector: 'dialog-add',
    templateUrl: './dialog-add.html'

})
export class DialogAdd implements OnInit {
    dialogForm: FormGroup;
    selectedFile: File;
    imagename: string;
    localurl = '../../assets/images/ic_choose_image.png';
    loading = false;
    errorMessage = '';
    isSelectedFile: boolean = false;


    constructor(private dialogFormBuilder: FormBuilder,
        private cd: ChangeDetectorRef,
        private api: ApiService,
        public dialogRef: MatDialogRef<DialogAdd>

    ) { }

    onCancel(): void {
        this.dialogRef.close();
    }

    ngOnInit() {
        this.dialogForm = this.dialogFormBuilder.group({
            title: ['', Validators.required],
            content: ['', Validators.required],
            file: ['',]
        });
    }

    onFileChange(event: any) {
        this.selectedFile = event.target.files[0];
        if (this.selectedFile) {
            this.isSelectedFile = true;
            this.errorMessage='';
        }

        // this.imagename = event.target.files[0].name;
        var reader = new FileReader();

        reader.onload = (event: any) => {
            this.localurl = event.target.result;
            // this.dialogForm.patchValue({
            //     file: reader.result
            // });
        }
        reader.readAsDataURL(event.target.files[0]);
        // this.cd.markForCheck();

    }

    uploadBand() {
        console.log('got card values ', typeof this.dialogForm);
        this.loading = true;
        if (!this.isSelectedFile) {
            this.errorMessage = "set the image first, then try again";
        } else {
            let formData: FormData = new FormData();
            formData.append('image', this.selectedFile, this.selectedFile.name);
            formData.append('title', this.dialogForm.value.title);
            formData.append('content', this.dialogForm.value.content);
            this.api.uploadBand(formData).subscribe(
                data => {
                    this.loading = false;
                    if (data.success) {
                        console.log('band successfully saved');
                        this.dialogRef.close();
                        window.location.reload();
                    } else {
                        this.errorMessage = data.data;
                        console.log('error in saving bands');
                    }
                }
            );
        }

    }


}