import { BlobServiceClient } from '@azure/storage-blob';

class AzureStorageService {
    private readonly containerName: string;
    private readonly blobServiceClient: BlobServiceClient;

    constructor() {
        this.containerName = 'events';
        this.blobServiceClient = BlobServiceClient.fromConnectionString(
            process.env.AZURE_STORAGE_CONNECTION_STRING ?? ''
        );
    }

    async uploadFile(file: Express.Multer.File): Promise<string> {
        if (!file) {
            return '';
        }
        const blobName = `${Date.now()}-${file.originalname}`;
        const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        
        await blockBlobClient.upload(file.buffer, file.size);
        return blockBlobClient.url;
    }

    async deleteFile(blobUrl: string): Promise<void> {
        const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
        // Extract blob name from the full URL
        const blobName = blobUrl.split('/').pop();
        
        if (!blobName) {
            throw new Error('Invalid blob URL');
        }

        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        await blockBlobClient.delete();
    }
}

export default new AzureStorageService();
