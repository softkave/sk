export interface IFeedbackAssignedTo {
  userId: string;
  assignedBy: string;
  assignedAt: string;
}

export enum FeedbackFieldType {
  Text = "text",
  Name = "name",
  FirstName = "firstName",
  LastName = "lastName",

  // TODO: should we allow to check root domains?
  Email = "email",
  Dropdown = "dropdown",
  Image = "image",
  Video = "video",
  Checkbox = "checkbox",
  Radio = "radio",
  Rating = "rating",
  Phone = "phone", // TODO: meta and value type, and their validation schemas
}

const feedbackFieldsMap: Record<FeedbackFieldType, boolean> = {
  [FeedbackFieldType.Text]: true,
  [FeedbackFieldType.Name]: true,
  [FeedbackFieldType.FirstName]: true,
  [FeedbackFieldType.LastName]: true,
  [FeedbackFieldType.Email]: true,
  [FeedbackFieldType.Dropdown]: true,
  [FeedbackFieldType.Image]: true,
  [FeedbackFieldType.Video]: true,
  [FeedbackFieldType.Checkbox]: true,
  [FeedbackFieldType.Radio]: true,
  [FeedbackFieldType.Rating]: true,
  [FeedbackFieldType.Phone]: true,
};

export const feedbackFieldsList = Object.keys(feedbackFieldsMap);

export interface IFeedbackFieldStringTypeMeta {
  minLength?: number;
  maxLength: number;
}

export interface IOption {
  option: string;
  description?: string;
}

export interface IFeedbackFieldDropdownTypeMeta {
  options: IOption[];
  multiple?: boolean;
  max?: number;
}

export interface IFeedbackFieldMediaTypeMeta {
  maxSize: number;
  multiple?: boolean;
  max: number;
}

export interface IFeedbackFieldCheckboxTypeMeta {
  options: IOption[];
  multiple?: boolean;
  max?: number;
}

export interface IFeedbackFieldRadioTypeMeta {
  options: IOption[];
}

export interface IFeedbackFieldRatingTypeMeta {
  max: number;

  // TODO: 'star' | 'emoji'; how do we specify the emojis to use
  iconForm: "star";
}

export type IFeedbackFieldMeta =
  | IFeedbackFieldStringTypeMeta
  | IFeedbackFieldDropdownTypeMeta
  | IFeedbackFieldMediaTypeMeta
  | IFeedbackFieldCheckboxTypeMeta
  | IFeedbackFieldRadioTypeMeta
  | IFeedbackFieldRatingTypeMeta;

export interface IFeedbackField<Meta extends IFeedbackFieldMeta = IFeedbackFieldMeta> {
  customId: string;
  createdBy: string;
  createdAt: string;
  lastUpdatedAt?: string;
  lastUpdatedBy?: string;
  organizationId: string;
  boardId: string;
  name?: string;
  programmaticId: string;
  description?: string;
  type: FeedbackFieldType;
  required?: boolean;
  public?: boolean;
  meta: Meta;
}

export interface IFieldInput {
  name?: string;
  programmaticId: string;
  description?: string;
  type: FeedbackFieldType;
  required?: boolean;
  // public?: boolean;
  meta: any;
}

// string | email | name | firstName | lastName
export interface IFeedbackFieldStringTypeValue {
  text: string;
}

export interface IFeedbackFieldDropdownTypeValue {
  selected: string[];
}

export interface IFeedbackFieldMediaTypeValue {
  URLs: string[];
}

export interface IFeedbackFieldCheckboxTypeValue {
  selected: string[];
}

export interface IFeedbackFieldRadioTypeValue {
  selected: string;
}

export interface IFeedbackFieldRatingTypeValue {
  rating: number;
}

export type IFeedbackFieldTypeValue =
  | IFeedbackFieldStringTypeValue
  | IFeedbackFieldDropdownTypeValue
  | IFeedbackFieldMediaTypeValue
  | IFeedbackFieldCheckboxTypeValue
  | IFeedbackFieldRadioTypeValue
  | IFeedbackFieldRatingTypeValue;

export interface IFeedbackFieldValue<
  Value extends IFeedbackFieldTypeValue = IFeedbackFieldTypeValue
> {
  valueId: string;
  feedbackId: string;
  organizationId: string;
  boardId: string;
  feedbackFieldId: string;
  programmaticId: string;
  type: FeedbackFieldType;
  value: Value;
  createdAt: string;
  createdBy?: string;
  lastUpdatedAt?: string;
  lastUpdatedBy?: string;
}

export const fieldsConstants = {
  maxNameLength: 150,
  maxDescriptionLength: 500,
  maxMetaOptions: 100,
  defaultMaxRatingNum: 5,
  maxFields: 100,
  maxMediaNum: 10,
};
