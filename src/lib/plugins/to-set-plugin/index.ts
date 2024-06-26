/**
 * MIT License
 * Copyright (c) 2021 RanYunLong<549510622@qq.com> @geckoai/class-transformer
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { TransformPlugin } from '../../transform-plugin';
import { TypeMirror } from '../../type-mirror';
import { TypedMetadata, TypedMetadataOptions } from '../../typed-metadata';
import { ValidateException } from '../../exceptions';
import { IValidator, validate } from '../../validate';
import {
  TransformerException,
  ValidateExceptionFields,
} from '../../exceptions';

/**
 * Set转换插件
 */
export class ToSetPlugin extends TransformPlugin {
  public static type = Set;

  /**
   * 类型验证
   */
  public validator(fieldValue: any): void {
    // 验证必须
    this.validateRequired(fieldValue);
    if (fieldValue !== undefined) {
      const { metadata, field } = this.typeMirror;
      // 先验证类型 系统规则
      const iValidators: IValidator[] = [
        {
          type: 'Set',
          validator: (value): boolean => value instanceof Set,
        },
      ];
      let nullable = false;
      // 设置手动添加的规则
      if (metadata) {
        const { options } = metadata;
        if (options) {
          nullable = !!options.nullable;
          const rules = TypedMetadata.mergeRule(options.rules || []);
          rules.forEach((rule) => {
            switch (rule.type) {
              case 'length':
                iValidators.push({
                  type: rule.type,
                  message: rule.message,
                  validator: (value: Set<any>) => value.size === rule.len,
                });
                break;
              case 'range':
                iValidators.push({
                  type: rule.type,
                  message: rule.message,
                  validator: (value: Set<any>) => {
                    let state = true;
                    if (rule.min !== undefined && value.size < rule.min) {
                      state = false;
                    }
                    if (rule.max !== undefined && value.size > rule.max) {
                      state = false;
                    }
                    return state;
                  },
                });
                break;
              case 'Enum':
                iValidators.push({
                  type: rule.type,
                  message: rule.message,
                  validator: (value: Set<any>) =>
                    Array.from(value).every((o) =>
                      (rule.enums || []).includes(o)
                    ),
                });
                break;
              default:
                throw ValidateException.create({
                  field,
                  fieldValue,
                  message: `The rule "${rule.type}" cannot be found.`,
                });
            }
          });
        }
      }
      if (nullable && fieldValue === null) {
        return;
      }
      // 验证
      validate(field, fieldValue, iValidators);
    }
  }

  /**
   * 转换成实例
   * @param values
   * @param allValues
   */
  public transform(values: any, allValues: any): any[] {
    values = this.beforeTransform(values, allValues);
    const originValues = values;
    this.validator(values);
    const { elementType, metadata, field } = this.typeMirror;
    if (values === undefined || values === null) {
      if (metadata && metadata.options && metadata.options.strict !== true) {
        return values;
      }
    }
    const typeMirror: TypeMirror = elementType();
    const exceptions: ValidateException[] = [];
    const fieldExceptions: ValidateExceptionFields = {};

    // 如果有子类型
    if (typeMirror) {
      values = new Set(
        Array.from(values).map((x: any, i: number) => {
          const newTypeMirror = TypeMirror.from(
            typeMirror.type,
            typeMirror.elementType
          );
          newTypeMirror.field = [field, i].join('.');
          newTypeMirror.parent = this.typeMirror;
          const options: TypedMetadataOptions = {};
          newTypeMirror.metadata = {
            type: newTypeMirror,
            options,
          };

          if (metadata && metadata.options && metadata.options.elementRules) {
            options.rules = metadata.options.elementRules;
          }

          try {
            return this.transformer.transform(newTypeMirror, x, values);
          } catch (e) {
            if (e instanceof ValidateException) {
              exceptions.push(e);
              const fieldsError = fieldExceptions[e.field];
              if (!fieldsError) {
                fieldExceptions[e.field] = [e];
              } else {
                fieldsError.push(e);
              }
            }
          }
        })
      );
    }

    // 统计异常
    if (exceptions.length) {
      let _type = 'any';
      if (typeMirror) {
        const _t = typeMirror.type();
        if (_t) {
          _type = _t.name;
        }
      }
      throw TransformerException.create({
        field,
        fieldValue: values,
        exceptions,
        fieldExceptions,
        message: `The value "${
          typeof values === 'object'
            ? JSON.stringify(originValues)
            : String(values)
        }" can't transform to "Set<${_type}>"`,
      });
    }
    // 直接返回
    return values;
  }
}
