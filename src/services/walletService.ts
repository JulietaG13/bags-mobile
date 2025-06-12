import AsyncStorage from '@react-native-async-storage/async-storage';
import { get, post } from '../config/api';
import { WalletInfo, TransferRequest, TransferHistoryPage } from '../types/wallet';
import { DebInRequest } from '../types';

export async function getWalletInfo(): Promise<WalletInfo> {
    const token = await AsyncStorage.getItem('token');
    const headers = {
        Authorization: `Bearer ${token}`,
    };

    const response = await get<WalletInfo>('/wallet', { headers });
    return response.data;
}

export async function transfer(data: TransferRequest): Promise<void> {
    const token = await AsyncStorage.getItem('token');
    const headers = {
        Authorization: `Bearer ${token}`,
    };

    await post('/transfer', data, { headers });
}

export async function getTransferHistory(page = 0, size = 5): Promise<TransferHistoryPage> {
    const token = await AsyncStorage.getItem('token');
    const headers = {
        Authorization: `Bearer ${token}`,
    };

    const response = await get<TransferHistoryPage>('/transfer', {
        headers,
        params: { page, size },
    });

    return response.data;
}

export async function requestDebIn(data: DebInRequest): Promise<void> {
    const token = await AsyncStorage.getItem('token');
    const headers = {
        Authorization: `Bearer ${token}`,
    };

    await post('/debin', data, { headers });
} 