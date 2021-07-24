import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  ApiUrl = environment.baseUrl

  constructor(
    public http: HttpClient
  ) { }


  Get_All_News_By_CityId(cityName) {
    return this.http.get(this.ApiUrl + 'news/get-news-by-city/' + cityName)
  }

}
