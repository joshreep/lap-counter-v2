import mockRunners from '@/test-utils/mock-data/runners'

const RunnersService = {
  getAll: jest.fn().mockResolvedValue(mockRunners),
  incrementRunnerLap: jest.fn().mockImplementation(() => Promise.resolve()),
  upsert: jest.fn().mockImplementation(() => Promise.resolve()),
  delete: jest.fn().mockImplementation(() => Promise.resolve()),
}

export default RunnersService
