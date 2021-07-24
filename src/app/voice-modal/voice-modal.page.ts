import { ModalController } from '@ionic/angular';
import { VoicerecorderService } from './../services/voicerecorder.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-voice-modal',
  templateUrl: './voice-modal.page.html',
  styleUrls: ['./voice-modal.page.scss'],
})
export class VoiceModalPage implements OnInit {

  constructor(
    public voicerecorderService: VoicerecorderService,
    public modalController: ModalController
  ) { }
  returnerIsPlaying() {
    return this.voicerecorderService.returnerIsPlaying();
  }
  isPlaying = false;
  playOrPause() {
    if (this.isPlaying) {
      this.voicerecorderService.playAudio();
      this.isPlaying = false;
    } else {
      this.voicerecorderService.stopAudioPlaying();
      this.isPlaying = true;
    }
  }
  retake() {
    this.voicerecorderService.retake();
  }
  isAudioRecordingEnded() {
    return this.voicerecorderService.isAudioRecordingEnded;
  }
  isAudioRecordingStarted() {
    return this.voicerecorderService.isAudioRecordingStarted;
  }
  getAudioPath() {
    return this.voicerecorderService.audioPath;
  }
  ngOnInit() {
  }
  playRecord() {
    this.voicerecorderService.playAudio();
  }
  stopRecord() {
    this.voicerecorderService.stopAudio();
  }
  startRecord() {
    this.voicerecorderService.captureAudio();
  }
  continue() {
    this.voicerecorderService.uploadFile();
    this.modalController.dismiss();
  }
  ionViewWillLeave() {
    this.retake();
    if (this.getAudioPath()) {
      this.stopRecord();
      this.voicerecorderService.stopAudioPlaying();
    }
  }
}
