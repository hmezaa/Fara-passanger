import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.page.html',
  styleUrls: ['./preferences.page.scss'],
})
export class PreferencesPage implements OnInit {

  constructor(
    public dataservice: DataService,
    private toastController: ToastController,
    private t: TranslateService,
  ) {

    t.get("PreferencesPage").subscribe((resp: any) => {
      this.respFromLanguage = resp;
    });
  }

  respFromLanguage: any;

  ngOnInit() {
  }
  callOptions = [
    {
      preference: 'Do not call under any circumstances'
    },
    {
      preference: 'Only in case of doubts'
    },
    {
      preference: 'When journey is accepted'
    },
    {
      preference: 'On arrival at pick point'
    },
    {
      preference: 'On accepting journey and on arrival'
    }
  ];
  ConversationOptions = [
    {
      preference: 'I prefer silence'
    },
    {
      preference: 'I like to chat'
    }
  ]
  openDoorOptions = [
    {
      preference: 'No'
    },
    {
      preference: 'At pick-up'
    },
    {
      preference: 'At drop Off'
    },
    {
      preference: 'At pick up and drop off'
    }
  ]
  airConditioningOptions = [
    {
      preference: 'On'
    },
    {
      preference: 'Off'
    }
  ]
  ionViewWillEnter() {
    this.dataservice.getMyPreferences()
      .subscribe((resp: any) => {
        if (resp) {
          this.data = resp;
          this.showList = true;
        }
      })
  }
  data = {
    call: '',
    airCondition: '',
    openDoor: '',
    conversation: ''
  }
  showList = false;
  preferencesChanged = false;
  onPrefferenceChange($event, name) {
    this.preferencesChanged = true;
    if (name == 'Call') {
      this.data.call = $event.detail.value;
    } else if (name == 'Conversation') {
      this.data.conversation = $event.detail.value;
    } else if (name == 'Open Door') {
      this.data.openDoor = $event.detail.value;
    } else if (name == 'Air conditioning') {
      this.data.airCondition = $event.detail.value;
    }
  }
  updatePreferences() {
    if (this.preferencesChanged) {
      this.preferencesChanged = false;
      this.dataservice.updatePrefernces(this.data).subscribe((resp: any) => {
        this.presentToast(this.respFromLanguage.preferencesUpdated)
      });
    } else {
      this.presentToast(this.respFromLanguage.noChanges)
    }
  }
  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      color: 'success',
      position: 'top',
      mode: 'ios',
      duration: 3000
    });
    toast.present();
  }
  getMyName() {
    if (localStorage.getItem('user'))
      return JSON.parse(localStorage.getItem('user')).firstName + ' ' + JSON.parse(localStorage.getItem('user')).lastName;
  }
}
