export interface Settings {
    sessionsConfig: SessionsConfig;
}

export interface SessionsConfig {
    studyingSessionDuration: number;
    shortBreakDuration: number;
    longBreakDuration: number;
    longBreakInterval: number;
}