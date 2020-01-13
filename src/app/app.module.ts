import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PomodoroComponent } from './pomodoro/pomodoro.component';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SettingsComponent } from './settings/settings.component';
import { HeaderComponent } from './header/header.component';

@NgModule({
	declarations: [
		AppComponent,
		PomodoroComponent,
		SettingsComponent,
		HeaderComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		RoundProgressModule,
		FontAwesomeModule,
		FormsModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {}
