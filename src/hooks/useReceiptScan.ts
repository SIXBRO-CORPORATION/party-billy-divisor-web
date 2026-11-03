import { useRef, useState } from 'react';
import { billService } from '../services/bill.service.ts';
import { isRetryableError } from '../utils/http-client.ts';
import { useToast } from './useToast.ts';
import type { ScannedProduct } from '../types/bill.ts';

const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024;

const RETRY_TOAST_DURATION = 8000;

export function useReceiptScan(onScanned: (items: ScannedProduct[]) => void) {
    const toast = useToast();
    const [isScanning, setIsScanning] = useState(false);

    const latestRequest = useRef(0);

    function cancel() {
        latestRequest.current += 1;
        setIsScanning(false);
    }

    async function scan(file: File): Promise<void> {
        if (!file.type.startsWith('image/')) {
            toast.error('Envie uma imagem (foto ou print da nota fiscal)');
            return;
        }

        if (file.size > MAX_IMAGE_SIZE_BYTES) {
            toast.error('Imagem muito grande (máximo 8MB)');
            return;
        }

        const requestId = ++latestRequest.current;

        setIsScanning(true);

        try {
            const items = await billService.scanReceipt(file);

            if (requestId === latestRequest.current) {
                onScanned(items);
            }
        } catch (error) {
            if (requestId !== latestRequest.current) {
                return;
            }

            const message =
                error instanceof Error ? error.message : 'Não foi possível ler a nota fiscal';

            if (isRetryableError(error)) {
                toast.error(message, RETRY_TOAST_DURATION, {
                    label: 'Tentar de novo',
                    onClick: () => {
                        void scan(file);
                    },
                });
            } else {
                toast.error(message);
            }
        } finally {
            if (requestId === latestRequest.current) {
                setIsScanning(false);
            }
        }
    }

    return { isScanning, scan, cancel };
}
