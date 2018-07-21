import { Component, OnInit, Inject, NgModule, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Time } from '@angular/common';
import { ApiService } from '../api.service';

@Component({
    selector:'dialog-delete',
    templateUrl:'delete-dialog.html'
})

export class DialogDelete implements OnInit{
    
    
    loading=false;
    id=this.data._id;
    bandName=this.data.title;
    


    constructor(private dialogFormBuilder: FormBuilder,
        private cd: ChangeDetectorRef,
        private api: ApiService,
        public dialogRef: MatDialogRef<DialogDelete>,
        @Inject(MAT_DIALOG_DATA) public data:any
        
    ) { }

    onCancel(): void {
        this.dialogRef.close();
    }

    ngOnInit() {
       
    }

    deleteBand():void{
        this.api.deleteBand(this.id).subscribe(
            data=>{
                this.loading=false;
                if(data.success){
                    console.log(data);
                    this.dialogRef.close();
                    window.location.reload();
                }else{
                    console.log('error in deleting the band');
                }
            }
        );
    }
}