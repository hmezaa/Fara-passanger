import { Component, OnInit } from '@angular/core';
import { NewsService } from '../services/news.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit {

  constructor(
    private newsService: NewsService,
  ) { }

  ngOnInit() { }

  news = []

  ionViewWillEnter() {
    let cityName = JSON.parse(localStorage.getItem('user')).city;
    this.newsService.Get_All_News_By_CityId(cityName)
      .subscribe((resp: any) => {
        console.log(resp)
        this.news = resp;
      })
  }

}
