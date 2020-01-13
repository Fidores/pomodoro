import { Settings } from './../models/settings';
import { SettingsService } from './../services/app-settings/settings.service';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsComponent } from './settings.component';
import { of } from 'rxjs';

describe('SettingsComponent', () => {
	let component: SettingsComponent;
	let fixture: ComponentFixture<SettingsComponent>;
	let settings: Partial<Settings>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [SettingsComponent],
			imports: [FormsModule, RouterModule.forRoot([])]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SettingsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		settings = {
			sessionsConfig: {
				shortBreakDuration: 0,
				longBreakDuration: 0,
				studyingSessionDuration: 0,
				longBreakInterval: 0
			}
		};
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('ngOnInit', () => {
		it('should call the server to get settings', () => {
			const settingsService: SettingsService = fixture.debugElement.injector.get(
				SettingsService
			);
			const spy = spyOn(settingsService, 'getSettings').and.returnValue(
				of(settings)
			);

			component.ngOnInit();

			expect(spy).toHaveBeenCalled();
		});

		it('should set settings property with data returned from the server', done => {
			const settingsService: SettingsService = fixture.debugElement.injector.get(
				SettingsService
			);
			spyOn(settingsService, 'getSettings').and.returnValue(of(settings));

			component.ngOnInit();

			settingsService
				.getSettings()
				.toPromise()
				.then(settings => {
					expect(component.settings).toEqual(settings);
					done();
				});
		});
	});

	describe('updateSettings', () => {
		it('should call the server to update settings', () => {
			const settingsService: SettingsService = fixture.debugElement.injector.get(
				SettingsService
			);
			const spy = spyOn(settingsService, 'setSettings').and.returnValue(
				of(settings)
			);

			component.updateSettings();

			expect(spy).toHaveBeenCalledWith(component.settings);
		});

		it('should update settings property with data returned from the server', () => {
			const settingsService: SettingsService = fixture.debugElement.injector.get(
				SettingsService
			);
			settings = ([1, 2, 3] as unknown) as Settings;
			spyOn(settingsService, 'setSettings').and.returnValue(of(settings));

			component.updateSettings();

			settingsService
				.setSettings(null)
				.toPromise()
				.then(settings => {
					expect(component.settings).toEqual(settings);
				});
		});

		it('should return to the home page after settings were successfully updated', () => {
			const settingsService: SettingsService = fixture.debugElement.injector.get(
				SettingsService
			);
			const router: Router = fixture.debugElement.injector.get(Router);
			const spy = spyOn(router, 'navigate');
			spyOn(settingsService, 'setSettings').and.returnValue(of(settings));

			component.updateSettings();

			settingsService
				.setSettings(null)
				.toPromise()
				.then(settings => {
					expect(spy).toHaveBeenCalledWith(['/']);
				});
		});
	});
});
