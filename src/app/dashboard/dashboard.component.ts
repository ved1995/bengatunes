import { Component, OnInit, Inject, NgModule } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ApiService } from '../api.service';
import { Data } from '../user';
import { Time } from '@angular/common';
import { DialogAdd } from './dialog-add.component';
import {DialogUpdate} from './update-dialog-component'
import { DialogDelete } from './delete-dialog-component';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  resultdata: any;

  bands;

  constructor(private api: ApiService, public dialog: MatDialog) { }

  ngOnInit() {
    this.api.getBands().subscribe(
      data => {
        if(data.success){
          this.bands = data.data;
        }else{
          alert(data.data);
        }
      }
    );
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAdd, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(
      result => {
        console.log('The result goes here', result);
        this.resultdata = result;
      }
    );
  }

  updateBand(band):void{
    console.log('bandId to update the band is:',band._id);
    const dialogRef=this.dialog.open(DialogUpdate,{
      width:'500px',
      data:band
      
    });
    dialogRef.afterClosed().subscribe(
      result=>{
        console.log('result: ',result);
      }
    );
  }
   
  deleteBand(band){
   console.log('the band to be deleted having id :',band._id);
   const dialogRef=this.dialog.open(DialogDelete,{
     width:'500px',
     data:band
   });
   dialogRef.afterClosed().subscribe(
     result=>{
       console.log('deleting the band');
     }
   );
  }
}

