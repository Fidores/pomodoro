import { SettingsService } from './services/app-settings/settings.service';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	constructor(private readonly settings: SettingsService) { }

	ngOnInit(): void {
		// Set default settings if none are available
		if (!this.settings.areAvailable) {
			localStorage.setItem(
				'settings',
				JSON.stringify({
					sessionsConfig: {
						studyingSessionDuration: 5,
						shortBreakDuration: 3,
						longBreakDuration: 7,
						longBreakInterval: 5
					}
				})
			);
		}
	}
}
