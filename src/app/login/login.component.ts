import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Validators} from '@angular/forms';
import { ApiService} from '../api.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm:FormGroup;
  username:string='';
  password:string='';
  errorMessage:string='';
  
  

  constructor(private formBuilder:FormBuilder,private api:ApiService, private router:Router) {  }

  ngOnInit() {
    this.createForm();
  }
  createForm(){
    this.loginForm=this.formBuilder.group({
      username:['', Validators.required],
      password:['', Validators.required]
    });

  }
  login(){
    this.api.login(this.loginForm.value.username,this.loginForm.value.password).subscribe(
      data=>{
        console.log(data);
        if (data.success){
          this.router.navigate(['dashboard']);
        }
        else{
          this.errorMessage=data.data;
          console.log('error in authentication');
          this.errorMessage='Either Username or password is wrong';
        }
      }
    );
  }
}
