import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import axios from 'axios';
import { RuleRunner, RuleRunnerAPIError, RuleRunnerConnectionError, ComplianceCheckResponse, HealthCheckResponse } from '../rulerunner';

// import jest from 'jest'; // Removed this line

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Create a mock Axios instance with interceptors
const mockAxiosInstance = {
    post: jest.fn<() => Promise<{ data: ComplianceCheckResponse }>>(),
    get: jest.fn<() => Promise<{ data: HealthCheckResponse }>>(),
    interceptors: {
        response: {
            use: jest.fn()
        }
    }
};

// Test data
const TEST_API_KEY = 'test_api_key_123';
const TEST_BASE_URL = 'http://test.api.rulerunner.com';
const TEST_FROM_ADDRESS = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
const TEST_TO_ADDRESS = '0x742d35Cc6634C0532925a3b844Bc454e4438f44f';
const TEST_AMOUNT = '10.0';

describe('RuleRunner', () => {
    let client: RuleRunner;

    beforeEach(() => {
        // Setup the mock to return our instance with interceptors
        mockedAxios.create.mockReturnValue(mockAxiosInstance as any);
        client = new RuleRunner({ apiKey: TEST_API_KEY, baseURL: TEST_BASE_URL });
        jest.clearAllMocks();
    });

    describe('initialization', () => {
        it('should initialize with required apiKey', () => {
            const client = new RuleRunner({ apiKey: TEST_API_KEY });
            expect(client).toBeInstanceOf(RuleRunner);
        });

        it('should throw error without apiKey', () => {
            expect(() => new RuleRunner({ apiKey: '' })).toThrow('API key is required');
        });

        it('should use custom baseURL when provided', () => {
            const client = new RuleRunner({ apiKey: TEST_API_KEY, baseURL: TEST_BASE_URL });
            expect(client).toBeInstanceOf(RuleRunner);
        });
    });

    describe('isCompliant', () => {
        const mockResponse = {
            is_compliant: true,
            message: 'Transaction is compliant',
            from_address_sanctioned: false,
            to_address_sanctioned: false,
            from_address_proof: undefined,
            to_address_proof: undefined,
            merkle_root: 'test_root',
            from_entity_details: null,
            to_entity_details: null,
            checked_lists: ['OFAC_LLM']
        };

        it('should make successful API call', async () => {
            mockAxiosInstance.post.mockResolvedValue({ data: mockResponse });

            const result = await client.isCompliant({
                from_address: TEST_FROM_ADDRESS,
                to_address: TEST_TO_ADDRESS,
                amount: TEST_AMOUNT
            });

            expect(result).toEqual(mockResponse);
        });

        it('should handle API errors', async () => {
            mockAxiosInstance.post.mockRejectedValue({
                response: {
                    status: 401,
                    data: { detail: 'Invalid API key' }
                }
            });

            await expect(client.isCompliant({
                from_address: TEST_FROM_ADDRESS,
                to_address: TEST_TO_ADDRESS,
                amount: TEST_AMOUNT
            })).rejects.toThrow(RuleRunnerAPIError);
        });

        it('should handle connection errors', async () => {
            mockAxiosInstance.post.mockRejectedValue({
                request: {}
            });

            await expect(client.isCompliant({
                from_address: TEST_FROM_ADDRESS,
                to_address: TEST_TO_ADDRESS,
                amount: TEST_AMOUNT
            })).rejects.toThrow(RuleRunnerConnectionError);
        });
    });

    describe('healthCheck', () => {
        const mockResponse = {
            status: 'ok',
            version: '1.0.0',
            sanctions_addresses_count: 1000,
            merkle_root: 'test_root',
            active_lists: ['OFAC_LLM']
        };

        it('should make successful API call', async () => {
            mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

            const result = await client.healthCheck();
            expect(result).toEqual(mockResponse);
        });

        it('should handle API errors', async () => {
            mockAxiosInstance.get.mockRejectedValue({
                response: {
                    status: 401,
                    data: { detail: 'Invalid API key' }
                }
            });

            await expect(client.healthCheck()).rejects.toThrow(RuleRunnerAPIError);
        });
    });

    describe('verifyProofLocally', () => {
        it('should verify valid proof', async () => {
            const address = '0x7FF9cFad3877F21d41Da833E2F775dB0569eE3D9';
            const proof: Array<{ position: 'left' | 'right'; data: string }> = [
                {
                  data: '66af3be0a459f23a7caf14b237e4f2bd7023966ef2531e5eba42e2c73d78bc67',
                  position: 'left'
                },
                {
                  data: '1721614e843e56a5be99be226102d5818557ea2cfc6a364e8f1a099dd270fe5b',
                  position: 'right'
                },
                {
                  data: '32565350c1a72cb10df8d4f5457156a0f6d6a1aa0e856e4599de2554c0d2916d',
                  position: 'right'
                },
                {
                  data: '1918f52a811cd9d7a9527053b44af28f1e68bd67dd46e4ea393e799bb01f58bc',
                  position: 'left'
                },
                {
                  data: '760e63e90a7c680201d189edede31f59f677caaf7398ffca1b353a9268d64c9a',
                  position: 'right'
                },
                {
                  data: 'f0b76cb1d219f3d392fff3b591e01a98bb5373b54a565aabd6623451cf13487b',
                  position: 'left'
                },
                {
                  data: 'b4372dbe311d0c0ca1f3dfeef96e4d1a29bfa13a7cf528bb2f923b8c5c01327c',
                  position: 'right'
                },
                {
                  data: '1ced6ee3cfd76af11b9f364b635b2020688cd972e735ae393e5d2a51e74dab74',
                  position: 'right'
                },
                {
                  data: 'a66760f05b1d880da49faa6e6aad2e830693e8a2ea16917f56efa66a1fc94771',
                  position: 'right'
                },
                {
                  data: 'f201d889c1b8aa5f86e2df49fb60d7e8001f16a2dd919dc645c80af358047397',
                  position: 'right'
                }
              ];
            const root = '2c548666c385cf032a095394e977e9124c566854e68fe163f6484ca0c58c6bf3';

            const result = await client.verifyProofLocally(address, proof, root);
            expect(result).toBe(true);
        });

        it('should reject invalid proof', async () => {
            const address = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
            const proof = [
                { position: 'right' as const, data: 'hash1' },
                { position: 'left' as const, data: 'hash2' }
            ];
            const root = 'different_hash';

            // Mock the sha256 method
            const mockSha256 = jest.fn<(str: string) => Promise<string>>()
                .mockResolvedValueOnce('742d35cc6634c0532925a3b844bc454e4438f44e_hashed')
                .mockResolvedValueOnce('742d35cc6634c0532925a3b844bc454e4438f44e_hashedhash1_hashed')
                .mockResolvedValueOnce('wrong_final_hash');

            // @ts-ignore - accessing private method for testing
            client['sha256'] = mockSha256;

            const result = await client.verifyProofLocally(address, proof, root);
            expect(result).toBe(false);
        });
    });
}); 