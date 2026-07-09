import { plugin, provide, token } from '@arki/dot/plugin';
/** The slice token adapters collect for one feature. */
export function tokenOf(feature) {
    return token()(`feature.${feature.name}`);
}
/** Compile one feature into the kernel unit `defineApp` mounts. */
export function plug(feature) {
    const tok = tokenOf(feature);
    const actions = [...feature.actions, ...feature.use.flatMap(slice => slice.actions)];
    const boot = async (ctx) => {
        const extra = feature.boot === undefined
            ? undefined
            : await feature.boot(ctx);
        const payloads = {};
        for (const slice of feature.use) {
            payloads[slice.key] = slice.resolve(ctx);
        }
        return { ...extra, ...provide(tok, payloads) };
    };
    // Factory seam: plugin()'s inference through the merged boot is erased
    // here and re-typed to the true shape declared above. defineFeature's
    // signature already enforced NoReservedKeys on the caller's needs.
    return plugin({
        name: feature.name,
        actions,
        needs: feature.needs,
        boot: boot,
    });
}
/** Tuple-typed pluck so `useAll`'s guard sees each plugin's exact type. */
export function plugs(features) {
    return features.map(f => plug(f));
}
/** The features' slice tokens, for adapters (`http`, `schedule`, workers). */
export function tokens(features) {
    return features.map(f => tokenOf(f));
}
//# sourceMappingURL=dot.js.map