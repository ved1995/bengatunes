import { Component, OnInit } from '@angular/core';
import {NgModule} from '@angular/core';
import { MatDialog } from '@angular/material';
import { DialogChangePassword } from './change-password-dialog.component';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  constructor(public dialog:MatDialog) { }
  updatePassword(){
    const dialogRef=this.dialog.open(DialogChangePassword,{
      width:'500px'
    });
    dialogRef.afterClosed().subscribe(
      result=>{
        console.log('result');
      }
    )
  }

  ngOnInit() {
  }

}
