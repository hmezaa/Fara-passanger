import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-help-and-support',
  templateUrl: './help-and-support.page.html',
  styleUrls: ['./help-and-support.page.scss'],
})
export class HelpAndSupportPage implements OnInit {

  constructor(public r: Router) { }

  ngOnInit() { }
  navlist = [
    { title: 'item1', icon: 'reader-outline', route: '/privacy-policy', },
    { title: 'item2', icon: 'warning-outline', route: '/terms-and-conditions', },
    { title: 'item3', icon: 'chatbubbles-outline', route: '/contact-us', },
    { title: 'item4', icon: 'people-outline', route: '/about-us', },
  ]
  route(r) {
    if (r == '/inviteFakePath') {
    } {
      this.r.navigate([r])
    }
  }
}
