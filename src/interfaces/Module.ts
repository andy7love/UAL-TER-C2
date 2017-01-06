export enum DroneModuleStatus {
    DISABLED = 0,
    ENABLED = 1
}

export enum DroneModuleCheckStatus {
    FAIL = 0,
    WARN = 1,
    DONE = 2
}

interface DroneModuleCheckResult {
    status: DroneModuleCheckStatus;
    message?: string;
}

export interface DroneModule {
    name: string;
    status: DroneModuleStatus;
    check(): Promise<DroneModuleCheckResult>;
    enable(): Promise<DroneModuleCheckResult>;
    disable(): Promise<DroneModuleStatus>;
}