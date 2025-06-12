export interface WalletInfo {
    balance: {
        amount: number;
    };
    currency: string;
}

export interface TransferRequest {
    toEmail: string;
    amount: number;
}

export interface ParticipantDto {
    serviceType: string;
    serviceName: string;
    email: string;
}

export interface TransferRecord {
    id: string;
    fromParticipant: ParticipantDto;
    toParticipant: ParticipantDto;
    timestamp: string;
    amount: number;
    type: 'IN' | 'OUT' | 'EXTERNAL_LOAD';
}

export interface TransferHistoryPage {
    content: TransferRecord[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
} 