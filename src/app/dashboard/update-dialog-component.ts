import { Component, OnInit, Inject, NgModule, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Time } from '@angular/common';
import { ApiService } from '../api.service';

@Component({
    selector:'update-dialog',
    templateUrl:'./update-dialog.html'
})

export class DialogUpdate implements OnInit{
    dialogForm: FormGroup;
    selectedFile: File;
    imagename: string;
    localurl = '../../assets/images/ic_choose_image.png';
    loading=false;
    errorMessage='';
    isFileSelected:boolean=false;
    


    constructor(private dialogFormBuilder: FormBuilder,
        private cd: ChangeDetectorRef,
        private api: ApiService,
        public dialogRef: MatDialogRef<DialogUpdate>,
        @Inject(MAT_DIALOG_DATA) public data:any
    ) { }

    onCancel(): void {
        this.dialogRef.close();
    }

    ngOnInit() {
        console.log('recieved data:',this.data);
        this.dialogForm = this.dialogFormBuilder.group({
            title: [this.data.title, Validators.required],
            content: [this.data.content, Validators.required],
            file: ['', ],
            id:['',]
        });
    }

    onFileChange(event: any) {
        this.selectedFile = event.target.files[0];
        // this.imagename = event.target.files[0].name;
        if(this.selectedFile){
            this.isFileSelected=true;
            this.errorMessage="";
        }
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
    
    

    updateBand(){
        console.log('updating value of the perticular band id',this.data);
        this.loading=true;
        if(!this.isFileSelected){
            this.errorMessage='image not selected !, please select the image first';
        }else{
            let formData:FormData=new FormData();
            formData.append('image',this.selectedFile,this.selectedFile.name);
            formData.append('title',this.dialogForm.value.title);
            formData.append('content',this.dialogForm.value.content);
            formData.append('id',this.data._id);
            this.api.updateBand(formData).subscribe(
                data=>{
                    this.loading=false;
                    if(data.success){
                        console.log('band updated successfully');
                        this.dialogRef.close();
                        window.location.reload();
                    }else{
                        this.errorMessage=data.data;
                        console.log('error in updating the bands');
                    }
                }
            );
        }
        
    }
}
