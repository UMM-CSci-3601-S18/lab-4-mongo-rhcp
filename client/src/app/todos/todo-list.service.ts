import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Observable} from "rxjs";

import {User} from './todo';
import {environment} from "../../environments/environment";


@Injectable()
export class UserListService {
    readonly baseUrl: string = environment.API_URL + "users";
    private userUrl: string = this.baseUrl;

    constructor(private http: HttpClient) {
    }

    getUsers(userCompany?: string): Observable<User[]> {
        this.filterByCompany(userCompany);
        return this.http.get<User[]>(this.userUrl);
    }

    getUserById(id: string): Observable<User> {
        return this.http.get<User>(this.userUrl + "/" + id);
    }

    /*
    //This method looks lovely and is more compact, but it does not clear previous searches appropriately.
    //It might be worth updating it, but it is currently commented out since it is not used (to make that clear)
    getUsersByCompany(userCompany?: string): Observable<User> {
        this.userUrl = this.userUrl + (!(userCompany == null || userCompany == "") ? "?company=" + userCompany : "");
        console.log("The url is: " + this.userUrl);
        return this.http.request(this.userUrl).map(res => res.json());
    }
    */

    filterByCompany(userCompany?: string): void {
        if(!(userCompany == null || userCompany == "")){
            if (this.userUrl.indexOf('company=') !== -1){
                //there was a previous search by company that we need to clear
                let start = this.userUrl.indexOf('company=');
                let end = this.userUrl.indexOf('&', start);
                this.userUrl = this.userUrl.substring(0, start-1) + this.userUrl.substring(end+1);
            }
            if (this.userUrl.indexOf('&') !== -1) {
                //there was already some information passed in this url
                this.userUrl += 'company=' + userCompany + '&';
            }
            else {
                //this was the first bit of information to pass in the url
                this.userUrl += "?company=" + userCompany + "&";
            }
        }
        else {
            //there was nothing in the box to put onto the URL... reset
            if (this.userUrl.indexOf('company=') !== -1){
                let start = this.userUrl.indexOf('company=');
                let end = this.userUrl.indexOf('&', start);
                if (this.userUrl.substring(start-1, start) === '?'){
                    start = start-1
                }
                this.userUrl = this.userUrl.substring(0, start) + this.userUrl.substring(end+1);
            }
        }
    }

    addNewUser(name: string, age: number, company : string, email : string): Observable<Boolean> {
        const body = {name:name, age:age, company:company, email:email};
        console.log(body);

        //Send post request to add a new user with the user data as the body with specified headers.
        return this.http.post<Boolean>(this.userUrl + "/new", body);
    }
}
