import { isFunction, pick } from "lodash";
import cast from "./cast";

export type ExtractFieldTransformer02<
  T,
  Result = any,
  ExtraArgs = any,
  From = object
> = (val: T, extraArgs: ExtraArgs, data: From) => Result;

export type ExtractFieldsDefaultScalarTypes =
  | undefined
  | boolean
  | string
  | number
  | bigint
  | symbol
  | null
  | Date;

export type ExtractFieldsFrom02<
  To extends object,
  From extends Partial<Record<keyof To, any>> = To,
  ExtraArgs = undefined,
  ScalarTypes = ExtractFieldsDefaultScalarTypes
> = {
  [Key in keyof Required<To>]: To[Key] extends ScalarTypes
    ?
        | boolean
        | ExtractFieldTransformer02<
            NonNullable<Required<From>[Key]>,
            Required<To>[Key],
            ExtraArgs,
            To
          >
    : ExtractFieldTransformer02<
        NonNullable<Required<From>[Key]>,
        Required<To>[Key],
        ExtraArgs,
        To
      >;
};

export interface IObjectPaths02<
  To extends object,
  From extends Partial<Record<keyof To, any>> = To,
  ExtraArgs = any
> {
  fromType: From;
  extraArgs: ExtraArgs;
  toType: To;
  scalarFields: string[];
  scalarFieldsWithTransformers: Array<{
    property: string;
    transformer: ExtractFieldTransformer02<any>;
  }>;
  finalizeFn?: (from: From, partialTo: Partial<To>, extraArgs: ExtraArgs) => To;
}

type FinalizeFnType<
  To extends object,
  From extends Partial<Record<keyof To, any>> = To,
  ExtraArgs = any
> = Record<keyof From, any> extends Record<keyof To, any>
  ? ((from: From, partialTo: To, extraArgs: ExtraArgs) => To) | undefined
  : (from: From, partialTo: Partial<To>, extraArgs: ExtraArgs) => To;

export function getFields02<
  To extends object,
  From extends Partial<Record<keyof To, any>> = To,
  ExtraArgs = any,
  ScalarTypes = ExtractFieldsDefaultScalarTypes
>(
  data: ExtractFieldsFrom02<To, From, ExtraArgs, ScalarTypes>,
  finalizeFn: FinalizeFnType<To, From, ExtraArgs>
): IObjectPaths02<To, From, ExtraArgs> {
  const keys = Object.keys(data);
  return keys.reduce(
    (paths, key) => {
      const value = data[key];
      if (isFunction(value)) {
        paths.scalarFieldsWithTransformers.push({
          property: key,
          transformer: value,
        });
      } else {
        paths.scalarFields.push(key);
      }

      return paths;
    },
    {
      scalarFields: [],
      scalarFieldsWithTransformers: [],
      fromType: cast<From>({}),
      extraArgs: cast<ExtraArgs>({}),
      toType: cast<To>({}),
      finalizeFn: finalizeFn,
    } as IObjectPaths02<To, From, ExtraArgs>
  );
}

export function extractFields02<
  ObjectPaths extends IObjectPaths02<any>,
  Data extends Partial<
    Record<keyof ObjectPaths["fromType"], any>
  > = ObjectPaths["fromType"]
>(
  data: Data,
  paths: ObjectPaths,
  extraArgs: ObjectPaths["extraArgs"]
): ObjectPaths["toType"] {
  let result = pick(data, paths.scalarFields);
  paths.scalarFieldsWithTransformers.forEach(({ property, transformer }) => {
    const propValue = data[property];
    if (propValue === undefined) {
      return;
    }

    result[property] =
      propValue === null ? null : transformer(propValue, extraArgs, data);
  });

  if (paths.finalizeFn) {
    result = paths.finalizeFn(data, result, extraArgs);
  }

  return result as unknown as ObjectPaths["toType"];
}

export function makeExtract02<T extends IObjectPaths02<any>>(fields: T) {
  const fn = <T1 extends T["fromType"]>(data: Partial<T1>) => {
    return extractFields02(data, fields, undefined);
  };

  return fn;
}

export function makeListExtract02<T extends IObjectPaths02<any>>(fields: T) {
  const fn = <T1 extends T["fromType"]>(data: Partial<T1>[]) => {
    return data.map((datum) => extractFields02(datum, fields, undefined));
  };

  return fn;
}
