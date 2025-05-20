import axios, { AxiosInstance } from 'axios';

export interface RuleRunnerConfig {
    apiKey: string;
    baseURL?: string;
}

export interface ComplianceCheckRequest {
    from_address: string;
    to_address: string;
    amount: string;
}

export interface ComplianceCheckResponse {
    is_compliant: boolean;
    message: string;
    from_address_sanctioned: boolean;
    to_address_sanctioned: boolean;
    from_address_proof?: Array<{ position: 'left' | 'right'; data: string }>;
    to_address_proof?: Array<{ position: 'left' | 'right'; data: string }>;
    merkle_root?: string;
    from_entity_details?: any;
    to_entity_details?: any;
    checked_lists: string[];
}

export interface HealthCheckResponse {
    status: string;
    version: string;
    sanctions_addresses_count: number;
    merkle_root?: string;
    active_lists: string[];
}

export class RuleRunnerError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'RuleRunnerError';
    }
}

export class RuleRunnerAPIError extends RuleRunnerError {
    constructor(message: string, public statusCode?: number) {
        super(message);
        this.name = 'RuleRunnerAPIError';
    }
}

export class RuleRunnerConnectionError extends RuleRunnerError {
    constructor(message: string) {
        super(message);
        this.name = 'RuleRunnerConnectionError';
    }
}

export class RuleRunnerProofVerificationError extends RuleRunnerError {
    constructor(message: string) {
        super(message);
        this.name = 'RuleRunnerProofVerificationError';
    }
}

export class RuleRunner {
    private client: AxiosInstance;

    constructor(config: RuleRunnerConfig) {
        if (!config.apiKey) {
            throw new RuleRunnerError('API key is required');
        }

        this.client = axios.create({
            baseURL: config.baseURL || 'https://api.rulerunner.io',
            headers: {
                'X-API-Key': config.apiKey,
                'Content-Type': 'application/json',
            },
        });
    }

    async isCompliant(request: ComplianceCheckRequest): Promise<ComplianceCheckResponse> {
        try {
            const response = await this.client.post<ComplianceCheckResponse>('/api/v1/isCompliant', request);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw new RuleRunnerAPIError(
                    error.response.data?.detail || 'API request failed',
                    error.response.status
                );
            } else if (error.request) {
                throw new RuleRunnerConnectionError('No response received from server');
            } else {
                throw new RuleRunnerError(error.message);
            }
        }
    }

    async healthCheck(): Promise<HealthCheckResponse> {
        try {
            const response = await this.client.get<HealthCheckResponse>('/api/v1/health');
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw new RuleRunnerAPIError(
                    error.response.data?.detail || 'API request failed',
                    error.response.status
                );
            } else if (error.request) {
                throw new RuleRunnerConnectionError('No response received from server');
            } else {
                throw new RuleRunnerError(error.message);
            }
        }
    }

    async verifyProofLocally(
        address: string,
        proof: Array<{ position: 'left' | 'right'; data: string }>,
        root: string
    ): Promise<boolean> {
        try {
            // Remove '0x' prefix and convert to lowercase
            const normalizedAddress = address.toLowerCase().replace('0x', '');
            // Hash the address
            const addressHash = await this.sha256(normalizedAddress);

            // Verify the proof
            let currentHash = addressHash;
            for (const step of proof) {
                const stepHash = step.data;
                if (step.position === 'left') {
                    currentHash = await this.sha256(stepHash + currentHash);
                } else {
                    currentHash = await this.sha256(currentHash + stepHash);
                }
            }

            return currentHash === root;
        } catch (error) {
            throw new RuleRunnerProofVerificationError(
                `Failed to verify proof: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    }

    private sha256(str: string): Promise<string> {
        return crypto.subtle.digest('SHA-256', new TextEncoder().encode(str)).then(buffer => {
            return Array.from(new Uint8Array(buffer))
                .map(byte => byte.toString(16).padStart(2, '0'))
                .join('');
        });
    }
} 