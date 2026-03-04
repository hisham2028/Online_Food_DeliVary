// Base Component
class BasicRepository {
  async findById(id) { return await this.adapter.findById(id); }
}

// Decorator: Adds caching
class CachingRepositoryDecorator extends RepositoryDecorator {
  async findById(id) {
    if (this.cache.has(id)) return this.cache.get(id);
    const result = await this.repository.findById(id);
    this.cache.set(id, result);
    return result;
  }
}

// Decorator: Adds logging
class LoggingRepositoryDecorator extends RepositoryDecorator {
  async findById(id) {
    console.log(`Finding ${id}...`);
    return await this.repository.findById(id);
  }
}