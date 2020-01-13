import { Settings } from './../models/settings';
import { SettingsService } from '../services/app-settings/settings.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(
    private _settings: SettingsService,
    private router: Router
  ) { }

  settings: Settings;

  ngOnInit() {
    this._settings.getSettings().toPromise().then(settings => this.settings = settings);
  }

  updateSettings() {
    this._settings.setSettings(this.settings).toPromise().then(settings => {
      this.router.navigate(['/']);
      this.settings = settings;
    });
  }

}
