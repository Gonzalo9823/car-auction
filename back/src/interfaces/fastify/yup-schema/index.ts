/* eslint-disable @typescript-eslint/no-explicit-any */
import { FastifyPluginCallback, FastifySchema } from 'fastify';
import fp from 'fastify-plugin';
import * as yup from 'yup';
import { AnyObject, AssertsShape, ObjectShape, TypeOfShape } from 'yup/lib/object';
import { Maybe, Optionals } from 'yup/lib/types';

// Custom Yup method
declare module 'yup' {
  interface ObjectSchema<
    TShape extends ObjectShape,
    TContext extends AnyObject = AnyObject,
    TIn extends Maybe<TypeOfShape<TShape>> = TypeOfShape<TShape>,
    TOut extends Maybe<AssertsShape<TShape>> = AssertsShape<TShape> | Optionals<TIn>
  > extends yup.BaseSchema<TIn, TContext, TOut> {
    uniqueProperty(value: string, message?: string): this;
  }

  interface ArraySchema<T> {
    unique(message?: string): ArraySchema<T>;
    uniqueCombinationOfProperties(value: string[], arrayName: string, message?: string): this;
  }

  interface StringSchema<TType extends Maybe<string> = string | undefined, TContext extends AnyObject = AnyObject, TOut extends TType = TType>
    extends yup.BaseSchema<TType, TContext, TOut> {
    optional(): this;
  }
}

yup.addMethod(yup.object, 'uniqueProperty', function (propertyName, message) {
  return this.test('unique_property', message, function (value: { [key: string]: unknown }) {
    if (!value || !value[propertyName]) {
      return true;
    }

    if (
      this.parent
        .filter((_value: unknown) => _value !== value)
        .some((_value: { [key: string]: unknown }) => _value[propertyName] === value[propertyName])
    ) {
      throw this.createError({
        path: `${this.path}.${propertyName}`,
      });
    }

    return true;
  });
});

yup.addMethod(yup.array, 'uniqueCombinationOfProperties', function (propertiesNames: string[], arrayName: string, message) {
  return this.test('unique', message, (list?: { [key: string]: unknown }[]) => {
    if (!list) {
      return true;
    }

    const addedValues: unknown[][] = [];
    const errors: ({ [key: string]: string } | undefined)[] = Array(list.length).fill(undefined);

    for (const value of list) {
      const listValues: unknown[] = [];
      for (const propertyName of propertiesNames) {
        listValues.push(value[propertyName]);
      }

      addedValues.push(listValues);
    }

    for (let i = 0; i < addedValues.length - 1; i++) {
      const equalRowsAndColumns: { [key: number]: boolean[] } = {};

      for (let j = i + 1; j < addedValues.length; j++) {
        const rowValues: unknown[] = [];
        const nextRowValues: unknown[] = [];

        for (let kIdx = 0; kIdx < propertiesNames.length; kIdx++) {
          rowValues.push(Object.values(addedValues[i])[kIdx]);
          nextRowValues.push(Object.values(addedValues[j])[kIdx]);
        }

        for (let kIdx = 0; kIdx < rowValues.length; kIdx++) {
          let addValue = false;

          if (rowValues[kIdx] === nextRowValues[kIdx]) {
            addValue = true;
          }

          if (equalRowsAndColumns[j]) {
            equalRowsAndColumns[j].push(addValue);
          } else {
            equalRowsAndColumns[j] = [addValue];
          }
        }
      }

      for (const [idx, value] of Object.entries(equalRowsAndColumns)) {
        if (value.filter((_value) => _value === true).length === propertiesNames.length) {
          const errorValues = value.reduce((_value, element, index) => {
            if (element === true) {
              return {
                ..._value,
                [propertiesNames[index]]: message,
              };
            }

            return _value;
          }, {} as { [key: string]: string });

          errors[i] = {
            ...errors[i],
            ...errorValues,
          };

          errors[parseInt(idx, 10)] = {
            ...errors[parseInt(idx, 10)],
            ...errorValues,
          };
        }
      }
    }

    if (errors.filter((error) => error !== undefined).length > 0) {
      const validationErrors: yup.ValidationError[] = [];

      errors.forEach((error, errorIdx) => {
        const _validationErrors: yup.ValidationError[] = [];

        if (error) {
          for (const [key, value] of Object.entries(error)) {
            _validationErrors.push(new yup.ValidationError(value, '', `${arrayName}[${errorIdx}].${key}`, ''));
          }

          validationErrors.push(..._validationErrors);
        }
      });

      return new yup.ValidationError(validationErrors);
    }

    return true;
  });
});

yup.addMethod(yup.array, 'unique', function (message, mapper = (value: unknown) => value) {
  return this.test('unique', message, (list?: unknown[]) => {
    if (!list) {
      return true;
    }

    return list.length === new Set(list.map(mapper)).size;
  });
});

yup.addMethod(yup.string, 'optional', function optional() {
  return this.transform((value) => {
    return (typeof value === 'string' && !value) || (value instanceof Array && !value.length) || value === null ? undefined : value;
  });
});

// Library
export interface YupOptions {
  strict: boolean;
  abortEarly: boolean;
  stripUnknown: boolean;
  recursive: boolean;
}

export interface CreateYupSchemaCallback {
  (yupCallback: typeof yup): FastifySchema;
}

const createYupValidatorCompiler =
  (_yupOptions: YupOptions) =>
  ({ schema }: any) =>
  (data: any) => {
    try {
      const result = schema.validateSync(data, {
        strict: false,
        abortEarly: false,
        stripUnknown: true,
        recursive: true,
      });
      return { value: result };
    } catch (error) {
      return { error: error as Error };
    }
  };

const fastifyYupSchemaPlugin: FastifyPluginCallback<YupOptions> = (fastify, options, done) => {
  const yupValidatorCompiler = createYupValidatorCompiler(options);
  fastify.setValidatorCompiler(yupValidatorCompiler);
  done();
};

export const fastifyYupSchema = fp(fastifyYupSchemaPlugin);

export const createYupSchema = (callBack: CreateYupSchemaCallback) => callBack(yup);
