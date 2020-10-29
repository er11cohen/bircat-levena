import { InjectionToken } from '@angular/core';
import enTranslationsDictionary from '../../../assets/i18n/en/translations';

export type TranslationsDictionary = typeof enTranslationsDictionary;

/**
 * ! Do not use this constant in components, always inject dictionary via DI!
 * ! Use this const only in units which are outside of DI (modules, raw functions, etc.)
 */
export const appTranslationsDictionary = transformObjectToPath(
  '',
  enTranslationsDictionary,
);

export const TRANSLATIONS_DICTIONARY = new InjectionToken<
  TranslationsDictionary
>('Translations dictionary', {
  providedIn: 'root',
  factory: () => appTranslationsDictionary,
});

function transformObjectToPath<T extends Node | string>(
  suffix: string,
  objectToTransformOrEndOfPath: T,
  path: string = '',
): T {
  return typeof objectToTransformOrEndOfPath === 'object'
    ? Object.entries(objectToTransformOrEndOfPath).reduce(
        (objectToTransform, [key, value]) => {
          const nestedObject = objectToTransform as Node;

          nestedObject[key] = transformObjectToPath(
            key,
            value,
            concatIfExistsPath(path, suffix),
          );

          return objectToTransform;
        },
        {} as T,
      )
    : (concatIfExistsPath(path, suffix) as T);
}

function concatIfExistsPath(path: string, suffix: string): string {
  return path ? `${path}.${suffix}` : suffix;
}

interface Node {
  // Transformer requires mutable structure
  /* tslint:disable-next-line:readonly-keyword */
  [key: string]: Node | string;
}
