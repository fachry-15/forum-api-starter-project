import { vi } from 'vitest';
import AddThreadUseCase from '../AddThreadUseCase.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import NewThread from '../../../Domains/threads/entities/NewThread.js';
import AddedThread from '../../../Domains/threads/entities/AddedThread.js';

describe('AddThreadUseCase', () => {
  it('should orchestrate the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'sebuah thread',
      body: 'sebuah body thread',
      owner: 'user-123',
    };

    // Nilai kembalian mock dibuat sebagai objek mentah yang berbeda dari expected value,
    // sehingga kita bisa memastikan use case benar-benar memproses hasil dari dependensi.
    const mockRepositoryResult = {
      id: 'thread-123',
      title: useCasePayload.title,
      owner: useCasePayload.owner,
    };

    const expectedAddedThread = new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: useCasePayload.owner,
    });

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.addThread = vi.fn().mockResolvedValue(mockRepositoryResult);

    const addThreadUseCase = new AddThreadUseCase({ threadRepository: mockThreadRepository });

    // Action
    const addedThread = await addThreadUseCase.execute(useCasePayload);

    // Assert
    expect(addedThread).toStrictEqual(expectedAddedThread);
    expect(mockThreadRepository.addThread).toHaveBeenCalledWith(new NewThread(useCasePayload));
  });
});
