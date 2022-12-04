export enum CollectionStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

export enum NftStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum DisplayType {
  BOOST_NUMBER = 'boost_number',
  BOOST_PERCENTAGE = 'boost_percentage',
  NUMBER = 'number',
  DATE = 'date',
}

export interface MetadataAttribute {
  trait_type?: string;
  value: string | number;
  max_value?: number;
  display_type?: DisplayType;
}

export interface MetadataDto {
  name?: string;

  description?: string;

  external_url?: string;

  animation_url?: string;

  youtube_url?: string;

  background_color?: string;

  attributes?: MetadataAttribute[];
}
