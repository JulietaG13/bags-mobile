import { get, post } from '../config/api';
import { WalletInfo, TransferRequest, TransferHistoryPage } from '../types/wallet';

export async function getWalletInfo(): Promise<WalletInfo> {
  const response = await get<WalletInfo>('/wallet');
  return response.data;
}

export async function transfer(data: TransferRequest): Promise<void> {
  await post('/transfer', data);
}

export async function getTransferHistory(page = 0, size = 5): Promise<TransferHistoryPage> {
  const response = await get<TransferHistoryPage>('/transfer', {
    params: { page, size },
  });
  return response.data;
} 