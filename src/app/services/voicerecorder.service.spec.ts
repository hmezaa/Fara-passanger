import { TestBed } from '@angular/core/testing';

import { VoicerecorderService } from './voicerecorder.service';

describe('VoicerecorderService', () => {
  let service: VoicerecorderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VoicerecorderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
