import { Component, OnDestroy, OnInit } from '@angular/core';
import { SignalrService } from "./../signalr-service";
import {NgForm} from "@angular/forms"

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {

  constructor(
   public signalrService: SignalrService
  ) { }

  ngOnInit(): void {
    this.authMeListenerSuccess();
    this.authMeListenerFail();
  }

  ngOnDestroy(): void {
    this.signalrService.hubConnection?.off("authMeResponseSuccess");
    this.signalrService.hubConnection?.off("authMeResponseFail");
  }

  onSubmit(form: NgForm){
    if(!form.valid){
      return;
    }

    this.authMe(form.value.userName, form.value.password);
    form.reset();
  }

  async authMe(user: string, password : string){
      let persomInfo ={
        userName : user,
        password : password
      };

      await this.signalrService.hubConnection?.invoke("AuthMe", persomInfo)
      .finally(() => {
        this.signalrService.toastr.info("loging in attempt...")
      })
      .catch(err => console.error(err));
  }

  private authMeListenerSuccess(){
    this.signalrService.hubConnection?.on("authMeResponseSuccess", (personInfo : any) => {
      console.log(personInfo);
      this.signalrService.personName = personInfo.userName;
      this.signalrService.toastr.success("Login succesed!");
      this.signalrService.routed.navigateByUrl("/home");
    });
  }

  private authMeListenerFail(){
    this.signalrService.hubConnection?.on("authMeResponseFail", () =>{
        this.signalrService.toastr.error("Wrong password or user name!");
    });
  }
}
