import { Module, Global } from '@nestjs/common';
import { LRUCache } from 'lru-cache';
import { LRU_CACHE } from 'src/common/common.constants';

@Global()
@Module({
  providers: [
    {
      provide: LRU_CACHE,
      useValue: new LRUCache({ max: 1000 }),
    },
  ],
  exports: [LRU_CACHE],
})
export class LRUCacheModule {}
