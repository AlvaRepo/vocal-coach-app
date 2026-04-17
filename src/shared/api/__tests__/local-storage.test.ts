import { describe, it, expect, beforeEach } from 'vitest';
import { LocalStorageRepository } from '../local-storage';

interface TestItem {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

describe('LocalStorageRepository', () => {
  let repository: LocalStorageRepository<TestItem>;
  const COLLECTION_KEY = 'test_collection';

  beforeEach(() => {
    repository = new LocalStorageRepository<TestItem>(COLLECTION_KEY);
  });

  it('should create and retrieve an item', async () => {
    const data = { name: 'Test Item' };
    const created = await repository.create(data);

    expect(created.id).toBeDefined();
    expect(created.name).toBe(data.name);
    expect(created.createdAt).toBeDefined();

    const retrieved = await repository.getById(created.id);
    expect(retrieved).toEqual(created);
  });

  it('should get all items', async () => {
    await repository.create({ name: 'Item 1' });
    await repository.create({ name: 'Item 2' });

    const all = await repository.getAll();
    expect(all).toHaveLength(2);
  });

  it('should update an item', async () => {
    const created = await repository.create({ name: 'Original' });
    const updated = await repository.update(created.id, { name: 'Updated' });

    expect(updated.name).toBe('Updated');
    expect(updated.id).toBe(created.id);
    
    const retrieved = await repository.getById(created.id);
    expect(retrieved?.name).toBe('Updated');
  });

  it('should delete an item', async () => {
    const created = await repository.create({ name: 'To be deleted' });
    await repository.delete(created.id);

    const retrieved = await repository.getById(created.id);
    expect(retrieved).toBeNull();
  });

  it('should query items with filters', async () => {
    await repository.create({ name: 'Search Me', type: 'special' } as any);
    await repository.create({ name: 'Ignore Me', type: 'normal' } as any);

    const results = await repository.query({ type: 'special' });
    expect(results).toHaveLength(1);
    expect(results[0]?.name).toBe('Search Me');
  });

  it('should search items by text', async () => {
    await repository.create({ name: 'Apple', description: 'Fruit' } as any);
    await repository.create({ name: 'Banana', description: 'Yellow' } as any);

    const results = await repository.search('app');
    expect(results).toHaveLength(1);
    expect(results[0]?.name).toBe('Apple');
  });
});
