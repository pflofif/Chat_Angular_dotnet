import { Injectable  } from "@angular/core";
import * as signalR from "@microsoft/signalr";
import { ToastrService } from 'ngx-toastr';
import { Router } from "@angular/router"

@Injectable({providedIn: "root"})

export class SignalrService{
    constructor(
        public toastr: ToastrService,
        public routed : Router
    ){}


    hubConnection:signalR.HubConnection | undefined;
    personName:string | undefined;

    startConnection = () => {
        this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:7090/chathub", {
            skipNegotiation: true,
            transport: signalR.HttpTransportType.WebSockets
        })
        .build();

        this.hubConnection
        .start()
        .then(() => {
            console.log("all is good!");
        })
        .catch(err => console.log("Error while starting connection " + err))
    }

}