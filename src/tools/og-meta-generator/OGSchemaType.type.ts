// Type definitions for shadcn/ui select components
// Compatible with @/components/ui/select

interface SelectOption {
  label: string;
  value: string;
}

interface SelectGroupOption {
  type: 'group';
  label: string;
  key?: string;
  children: SelectOption[];
}

interface OGSchemaTypeElementBase {
  key: string;
  label: string;
  placeholder: string;
}

export interface OGSchemaTypeElementInput extends OGSchemaTypeElementBase {
  type: 'input';
}

export interface OGSchemaTypeElementInputMultiple extends OGSchemaTypeElementBase {
  type: 'input-multiple';
}

export interface OGSchemaTypeElementSelect extends OGSchemaTypeElementBase {
  type: 'select';
  options: Array<SelectOption | SelectGroupOption>;
}

export interface OGSchemaType {
  name: string;
  elements: (OGSchemaTypeElementSelect | OGSchemaTypeElementInput | OGSchemaTypeElementInputMultiple)[];
}