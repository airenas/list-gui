export interface TranscriptionResult {
    id: string;
    status: string;
    errorCode?: string;
    error?: string;
    recognizedText?: string;
    progress?: number;
    audioReady?: boolean;
    avResults?: string[];
}
