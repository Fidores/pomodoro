import { TestBed } from '@angular/core/testing';

import { SettingsService } from './settings.service';
import { Settings } from 'src/app/models/settings';

describe('SettingsService', () => {
  let fakeSettings: Partial<Settings> = {
    sessionsConfig: {
      longBreakDuration: 4,
      shortBreakDuration: 3,
      studyingSessionDuration: 5,
      longBreakInterval: 4
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({});
    localStorage.setItem('settings', JSON.stringify(fakeSettings));
  });

  it('should be created', () => {
    const service: SettingsService = TestBed.get(SettingsService);
    expect(service).toBeTruthy();
  });

  describe('setSettings', () => {

    it('should return observable of new settings', (done: DoneFn) => {
      const service: SettingsService = TestBed.get(SettingsService);
      
      fakeSettings.sessionsConfig.longBreakDuration = 99;

      service.setSettings(fakeSettings as Settings).subscribe(settings => {
        expect(settings.sessionsConfig.longBreakDuration).toBe(99);
        done();
      });

    });

  });

  describe('getSettings', () => {

    it('should return settings', (done: DoneFn) => {
      const service: SettingsService = TestBed.get(SettingsService);

      service.getSettings().subscribe(settings => {
        expect(settings).toEqual(fakeSettings);
        done();
      });

    })

  });

  describe('areAvailable', () => {

    it('should return weather settings are available', () => {
      const service: SettingsService = TestBed.get(SettingsService);
      
      expect(service.areAvailable).toBeTruthy();
      
      localStorage.clear();

      expect(service.areAvailable).toBeFalsy();
    })

  });
});
