export interface FeatureDto {
  id?: string | number;
  name: string;
  type: FeatureTypeEnum;
}

export enum FeatureTypeEnum {
  Form,
  Widget
}
