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

export interface TransferHistoryPage {
    content: TransferRecord[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
}

export interface TransferRecord {
    fromEmail: string;
    toEmail: string;
    amount: number;
    timestamp: string;
    transferNumber: string;
    direction: 'IN' | 'OUT';
} 