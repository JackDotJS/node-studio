declare const memUsage: () => NodeJS.MemoryUsage;
declare const setProjectTitle: (text: string) => void;
declare const DRPCResetTime: () => void;

declare function isInterface<T>(obj: any, key: keyof T): obj is T; 