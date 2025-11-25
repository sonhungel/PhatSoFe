import { createMapper, Mapper } from '@automapper/core';
import { pojos } from '@automapper/pojos';

// Create the mapper instance with pojos strategy
export const mapper = createMapper({
  strategyInitializer: pojos(),
});

// Export types for use in profiles
export type { Mapper };