
import { __NameCamelCase__Entity } from '../entities/__nameKebabCase__-entity';

export interface __NameCamelCase__Repository {
  insert(entity: __NameCamelCase__Entity): Promise<__NameCamelCase__Entity>;
  update(entity: __NameCamelCase__Entity): Promise<__NameCamelCase__Entity>;
  remove(id: string): Promise<void>;
  getAll(): Promise<__NameCamelCase__Entity[]>;
  getById(id: string): Promise<__NameCamelCase__Entity>;
}
