import { SessionsConfig } from './../models/settings';
import { SettingsService } from '../services/app-settings/settings.service';
import { TimerModes } from './../models/timerModes';
import { BreakTypes } from '../models/breakTypes';
import { TimerStatuses } from './../models/timerStatuses';
import { Component, OnInit, OnDestroy } from '@angular/core';

import {
	faStop,
	faPause,
	faStepForward,
	faPlay
} from '@fortawesome/free-solid-svg-icons';
import { Subscription, interval } from 'rxjs';

@Component({
	selector: 'app-pomodoro',
	templateUrl: './pomodoro.component.html',
	styleUrls: ['./pomodoro.component.scss']
})
export class PomodoroComponent implements OnInit, OnDestroy {
	constructor(private _settings: SettingsService) { }

	faStop = faStop;
	faPause = faPause;
	faStepForward = faStepForward;
	faPlay = faPlay;

	pomodoroConfig: SessionsConfig = {
		studyingSessionDuration: 3,
		shortBreakDuration: 4,
		longBreakDuration: 5,
		longBreakInterval: 5
	};

	timer = interval(1000);
	timerSubscription: Subscription;

	timePassed = 0;
	sessionDuration: number;
	numberOfBreaks = 1;

	status: TimerStatuses = 'stopped';
	statuses = {
		break: {
			color: '#5fd32e'
		},
		running: {
			color: '#d32f2e'
		},
		stopped: {
			color: '#2e70d3'
		},
		pending: {
			color: '#d3962e'
		}
	};

	ngOnInit() {
		this._settings
			.getSettings()
			.toPromise()
			.then(settings => {
				if (!settings) return; 
				this.pomodoroConfig = settings.sessionsConfig;
				this.sessionDuration = this.pomodoroConfig.studyingSessionDuration;
			});
	}

	ngOnDestroy() {
		if (this.timerSubscription) this.timerSubscription.unsubscribe();
	}

	startBreak(type: BreakTypes): void {
		const notification = new Audio(
			'../../assets/sounds/notifications/start_break.wav'
		);

		notification.play();
		this.numberOfBreaks++;
		this.status = 'break';
		this.setTimerFor(type);

		this.timerSubscription = this.timer.subscribe(() => {
			if (this.timePassed >= this.sessionDuration) return this.startStudying();

			this.timePassed++;
		});
	}

	startStudying(): void {
		const notification = new Audio(
			'../../assets/sounds/notifications/end_break.wav'
		);

		notification.play();
		this.setTimerFor('studyingSession');
		this.status = 'running';

		this.timerSubscription = this.timer.subscribe(() => {
			if (this.timePassed >= this.sessionDuration) {
				if (this.sessionsLeftToLongerBreak !== 0)
					return this.startBreak('shortBreak');
				else if (this.sessionsLeftToLongerBreak === 0)
					return this.startBreak('longBreak');
			}

			this.timePassed++;
		});
	}

	reset(): void {
		this.status = 'stopped';
		if (this.timerSubscription) this.timerSubscription.unsubscribe();
		this.timePassed = 0;
		this.numberOfBreaks = 1;
	}

	pause(): void {
		this.status = 'pending';
		if (this.timerSubscription) this.timerSubscription.unsubscribe();
	}

	get sessionsLeftToLongerBreak(): number {
		return (
			this.pomodoroConfig.longBreakInterval - 1 - ((this.numberOfBreaks - 1) % this.pomodoroConfig.longBreakInterval)
		);
	}

	get remainingTime(): string {
		const remainingMinutes = Math.floor(
			(this.sessionDuration - this.timePassed) / 60
		);
		const remainingSeconds = (this.sessionDuration - this.timePassed) % 60;
		return (
			`0${remainingMinutes}`.slice(-2) + ':' + `0${remainingSeconds}`.slice(-2)
		);
	}

	get isStopped(): boolean {
		return this.status === 'stopped' || this.status === 'pending';
	}

	private setTimerFor(mode: TimerModes): void {
		if (this.status !== 'pending') {
			this.timePassed = 0;
			this.sessionDuration = this.pomodoroConfig[`${mode}Duration`];
		}
		if (this.timerSubscription) this.timerSubscription.unsubscribe();
	}
}
