import { Settings } from '../../models/settings';
import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class SettingsService {
	constructor() {}

	/**
	 * Saves new settings.
	 * @param settings New settings to save.
	 */

	setSettings(settings: Settings): Observable<Settings> {
		localStorage.setItem('settings', JSON.stringify(settings));

		return of(this.settings);
	}

	/**
	 * Returns object of settings.
	 */

	getSettings(): Observable<Settings> {
		return of(this.settings);
	}

	/**
	 * Informs if settings are set.
	 */

	get areAvailable(): boolean {
		return !!this.settings;
	}

	private get settings(): Settings {
		return JSON.parse(localStorage.getItem('settings'));
	}
}
