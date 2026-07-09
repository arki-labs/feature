/**
 * The DOT projection of a feature — the only module in this package
 * that touches the kernel at runtime.
 *
 * `plug(feature)` compiles a declaration into a DOT plugin: the
 * feature's slice payloads are published under a derived token
 * (`feature.<name>`) that package adapters collect (`http({ features })`,
 * `schedule({ features })`, `queueRuntime({ features })`), slice
 * actions join the manifest so `dot explain` attributes them to the
 * feature, and the `needs`/`boot` escape hatch becomes the plugin's
 * lifecycle. Tokens are key-string witnesses, so `plug` and `tokens`
 * derive them independently without shared state.
 */
import type { Plugin, ServiceRecord, Token, WireNeeds } from '@arki/dot/plugin';
import type { AnyFeature, SlicePayloads } from './index.js';
type FeatureTokenOf<F extends AnyFeature> = Token<SlicePayloads<F['use']>, `feature.${F['name']}`>;
type BootFnOf<F extends AnyFeature> = Exclude<F['boot'], undefined>;
type NonVoidProvides<T> = [Exclude<T, void>] extends [never] ? Record<never, never> : Exclude<T, void> extends ServiceRecord ? Exclude<T, void> : Record<never, never>;
/**
 * What the feature's boot escape hatch provides. `boot` is an optional
 * property, so `undefined` must be split off before matching the
 * function shape — and a void-only boot must resolve to an empty record
 * rather than `never` (a `never` arm would poison the whole provides
 * intersection).
 */
type ProvidesOf<F extends AnyFeature> = [BootFnOf<F>] extends [never] ? Record<never, never> : BootFnOf<F> extends (services: never) => infer R ? NonVoidProvides<Awaited<R>> : Record<never, never>;
/**
 * The plugin type `plug` produces. `WireNeeds` unwraps the witness
 * record to value types — the `use`/`useAll` guard compares
 * availability against values, exactly as `plugin()` returns.
 */
export type PluginOf<F extends AnyFeature> = Plugin<WireNeeds<F['needs']>, ProvidesOf<F> & Readonly<Record<`feature.${F['name']}`, SlicePayloads<F['use']>>>>;
/** The slice token adapters collect for one feature. */
export declare function tokenOf<F extends AnyFeature>(feature: F): FeatureTokenOf<F>;
/** Compile one feature into the kernel unit `defineApp` mounts. */
export declare function plug<F extends AnyFeature>(feature: F): PluginOf<F>;
/** Tuple-typed pluck so `useAll`'s guard sees each plugin's exact type. */
export declare function plugs<const T extends readonly AnyFeature[]>(features: T): {
    readonly [I in keyof T]: PluginOf<T[I]>;
};
/** The features' slice tokens, for adapters (`http`, `schedule`, workers). */
export declare function tokens<const T extends readonly AnyFeature[]>(features: T): {
    readonly [I in keyof T]: FeatureTokenOf<T[I]>;
};
export {};
//# sourceMappingURL=dot.d.ts.map