import { SettingsService } from './../services/app-settings/settings.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PomodoroComponent } from './pomodoro.component';
import { of, Subscription } from 'rxjs';
import { Settings } from '../models/settings';

describe('PomodoroComponent', () => {
	let component: PomodoroComponent;
	let fixture: ComponentFixture<PomodoroComponent>;
	let settings: Settings;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [PomodoroComponent],
			imports: [RoundProgressModule, FontAwesomeModule]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PomodoroComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		settings = {
			sessionsConfig: {
				shortBreakDuration: 5,
				longBreakDuration: 5,
				studyingSessionDuration: 5,
				longBreakInterval: 5
			}
		};
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('ngOnInit', () => {
		it('should call server to get settings', () => {
			const settingsService: SettingsService = fixture.debugElement.injector.get(
				SettingsService
			);
			const spy = spyOn(settingsService, 'getSettings').and.returnValue(
				of(settings)
			);

			component.ngOnInit();

			expect(spy).toHaveBeenCalled();
		});

		it('should set pomodoroConfig property with sessionsConfig retuned from the server', () => {
			const settingsService: SettingsService = fixture.debugElement.injector.get(
				SettingsService
			);
			spyOn(settingsService, 'getSettings').and.returnValue(of(settings));

			component.ngOnInit();

			settingsService
				.getSettings()
				.toPromise()
				.then(s => {
					expect(component.pomodoroConfig).toEqual(settings.sessionsConfig);
				});
		});

		it('should set sessionDuration property with duration returned from the server', () => {
			const settingsService: SettingsService = fixture.debugElement.injector.get(
				SettingsService
			);
			spyOn(settingsService, 'getSettings').and.returnValue(of(settings));

			component.ngOnInit();

			settingsService
				.getSettings()
				.toPromise()
				.then(s => {
					expect(component.sessionDuration).toEqual(
						settings.sessionsConfig.studyingSessionDuration
					);
				});
		});
	});

	describe('ngOnDestroy', () => {
		it('should unsubscribe from timer subscription if it exists', () => {
			component.timerSubscription = new Subscription();
			const spy = spyOn(component.timerSubscription, 'unsubscribe');

			component.ngOnDestroy();

			expect(spy).toHaveBeenCalled();
		});
	});

	describe('startBreak', () => {
		it('should increment number of breaks', () => {
			component.numberOfBreaks = 1;

			component.startBreak(null);

			expect(component.numberOfBreaks).toBe(2);
		});

		it('should set status to break', () => {
			component.status = null;

			component.startBreak(null);

			expect(component.status).toBe('break');
		});

		it('should set timer for given type of break', () => {
			const spy = spyOn<any>(component, 'setTimerFor');

			component.startBreak('longBreak');

			expect(spy).toHaveBeenCalledWith('longBreak');

			component.startBreak('shortBreak');

			expect(spy).toHaveBeenCalledWith('shortBreak');
		});

		it('should set store timer subscription in timerSubscription property', () => {
			component.timerSubscription = null;

			component.startBreak(null);

			expect(component.timerSubscription).toBeTruthy();
		});

		it('should subscribe to the timer', () => {
			const spy = spyOn(component.timer, 'subscribe');

			component.startBreak(null);

			expect(spy).toHaveBeenCalled();
		});
	});

	describe('startStudying', () => {
		it('should set timer for studying', () => {
			const spy = spyOn<any>(component, 'setTimerFor');

			component.startStudying();

			expect(spy).toHaveBeenCalledWith('studyingSession');
		});

		it('should set status to running', () => {
			component.status = null;

			component.startStudying();

			expect(component.status).toBe('running');
		});

		it('should subscribe to the timer', () => {
			const spy = spyOn(component.timer, 'subscribe');

			component.startStudying();

			expect(spy).toHaveBeenCalled();
		});
	});

	describe('reset', () => {
		it('should set status to stopped', () => {
			component.status = null;

			component.reset();

			expect(component.status).toBe('stopped');
		});

		it('should unsubscribe from timer subscription if it exists', () => {
			component.timerSubscription = new Subscription();
			const spy = spyOn(component.timerSubscription, 'unsubscribe');

			component.reset();

			expect(spy).toHaveBeenCalled();
		});

		it('should reset passed time to initial value', () => {
			component.timePassed = 10;

			component.reset();

			expect(component.timePassed).toBe(0);
		});

		it('should reset number of break to initial value', () => {
			component.numberOfBreaks = 10;

			component.reset();

			expect(component.numberOfBreaks).toBe(1);
		});
	});

	describe('pause', () => {
		it('should set status to pending', () => {
			component.status = null;

			component.pause();

			expect(component.status).toBe('pending');
		});

		it('should unsubscribe from timer subscription if it exists', () => {
			component.timerSubscription = new Subscription();
			const spy = spyOn(component.timerSubscription, 'unsubscribe');

			component.pause();

			expect(spy).toHaveBeenCalled();
		});
	});

	describe('remainingTime', () => {
		it('should return remaining time to the end of session', () => {
			component.sessionDuration = 80;
			component.timePassed = 10;

			const remainingTime = component.remainingTime;

			expect(remainingTime).toContain('01:10');
		});
	});

	describe('sessionsLeftToLongerBreak', () => {
		it('should return number of sessions left to longer break', () => {
			component.numberOfBreaks = 2;

			const sessionsLeftToLongerBreak = component.sessionsLeftToLongerBreak;

			expect(sessionsLeftToLongerBreak).toBe(3);
		});
	});
});
