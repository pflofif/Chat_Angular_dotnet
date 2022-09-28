import { Component, OnDestroy, OnInit } from '@angular/core';
import { SignalrService } from '../signalr-service';
import {NgForm} from "@angular/forms"

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

  constructor(
    public signalrService: SignalrService
  ) { }


  ngOnInit(): void {
    this.registerMeListenerSuccess();
    this.registerMeResponseFailEmptyFields();
    this.registerMeResponseFailPersonExist();
  }

  ngOnDestroy(): void {
    this.signalrService.hubConnection?.off("registerMeResponseSuccess");
    this.signalrService.hubConnection?.off("registerMeResponseFailEmptyFields");
    this.signalrService.hubConnection?.off("registerMeResponseFailPersonExist");
  }

  onSubmit(form: NgForm){
    if(!form.valid){
      return;
    }

    this.registerMe( form.value.realName ,form.value.userName, form.value.password);
    form.reset();
  }

  async registerMe(realName : string , userName: string, password : string){
    let persomInfo ={
      realName : realName,
      userName : userName,
      password : password
    };

    await this.signalrService.hubConnection?.invoke("RegisterMe", persomInfo)
    .finally(() => {
      this.signalrService.toastr.info("register in attempt...")
    })
    .catch(err => console.error(err));
  }

  private registerMeListenerSuccess(){
    this.signalrService.hubConnection?.on("registerMeResponseSuccess", (personInfo : any) => {
      console.log(personInfo);
      this.signalrService.personName = personInfo.realName;
      this.signalrService.toastr.success("Register succesed!");
      this.signalrService.routed.navigateByUrl("/auth");
    });
  }

  private registerMeResponseFailEmptyFields(){
    this.signalrService.hubConnection?.on("registerMeResponseFailEmptyFields", () =>{
        this.signalrService.toastr.error("Please enter Empty Fileds!");
    });
  }

  private registerMeResponseFailPersonExist(){
    this.signalrService.hubConnection?.on("registerMeResponseFailPersonExist", () =>{
        this.signalrService.toastr.error("This account already exist!");
    });
  }
}
