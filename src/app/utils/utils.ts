import { HttpHeaders } from "@angular/common/http";
import { throwError } from "rxjs";
import { environment } from "../../environments/environment";

export const API_URL: string = environment.apiUrl;

export const HTTP_OPTIONS = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`
  })
};

export const handleError = error => {
  let errorMessage = "";
  console.log(error);
  if (error.error.error.description !== undefined) {
    errorMessage = error.error.error.description;
  } else {
    for (const key in error.error.error) {
      errorMessage = `ERROR: Field ${key}\nMessage: ${error.error.error[key][0]}`;
    }
    errorMessage === ("" || undefined)
      ? (errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}\nConsulte o log para mais detalhes.`)
      : null;
  }
  console.error(error.error.error);
  window.alert(errorMessage);
  return throwError(errorMessage);
};
