import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule,MatCheckboxModule} from '@angular/material';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material';
import {MatFormFieldModule} from '@angular/material';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule, Router, Routes} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatDialogModule} from '@angular/material/dialog';
import {MAT_DIALOG_DEFAULT_OPTIONS} from '@angular/material/dialog';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatToolbarModule} from '@angular/material/toolbar';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent} from './dashboard/dashboard.component';
import { ApiService} from './api.service';
import { DialogAdd} from './dashboard/dialog-add.component';
import {DialogUpdate} from './dashboard/update-dialog-component';
import {DialogDelete} from './dashboard/delete-dialog-component';
import { NavigationComponent } from './navigation/navigation.component';
import {DialogChangePassword} from './navigation/change-password-dialog.component';

const routes:Routes=[
  {path:'',redirectTo:'login',pathMatch:'full'},
  {path:'dashboard',component:DashboardComponent},
  {path:'login',component:LoginComponent},
  
]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    DialogAdd,
    DialogUpdate,
    DialogDelete,
    NavigationComponent,
    DialogChangePassword
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatIconModule,
    MatGridListModule,
    MatDialogModule,
    MatProgressBarModule,
    FlexLayoutModule,
    MatToolbarModule,
    RouterModule.forRoot(routes)

  ],
  entryComponents:[DialogAdd,DialogUpdate,DialogDelete,DialogChangePassword],
  providers: [
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: true}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
