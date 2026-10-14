/**
 * Declare a feature. Pure data capture — nothing executes here, and no
 * engine is referenced; the DOT projection happens in
 * `@arki/feature/dot`.
 */
export function defineFeature(name, config) {
    return {
        name,
        router: (config.router ?? {}),
        repos: (config.repos ?? {}),
        use: (config.use ?? []),
        actions: config.actions ?? [],
        needs: (config.needs ?? {}),
        boot: config.boot,
    };
}
export const FEATURE_ERROR_CODES = {
    duplicateRouterKey: 'FEATURE_E001',
    duplicateRepoKey: 'FEATURE_E002',
};
/**
 * A mistake in how features are composed. The types reject the same
 * mistake at compile time; this is the backstop for code that skips them.
 */
export class FeatureError extends Error {
    code;
    remediation;
    constructor(args) {
        super(args.message);
        this.name = 'FeatureError';
        this.code = args.code;
        this.remediation = args.remediation;
    }
}
/**
 * Fold the features' router fragments into one router — value AND type
 * from the single list. A mount key claimed by two features is a compile
 * error, and throws `FeatureError` at module load for code that skips types.
 */
export function composeRouter(features) {
    const merged = {};
    for (const f of features) {
        for (const [key, fragment] of Object.entries(f.router)) {
            if (key in merged) {
                throw new FeatureError({
                    code: FEATURE_ERROR_CODES.duplicateRouterKey,
                    message: `[feature] router mount key "${key}" is contributed by more than one feature.`,
                    remediation: 'Give each feature its own router mount key, or merge the two fragments in one feature.',
                });
            }
            merged[key] = fragment;
        }
    }
    return merged;
}
/**
 * Fold the features' repo factories over one db handle. A repo key claimed
 * by two features is a compile error, and throws `FeatureError` for code
 * that skips types.
 */
export function composeRepos(features, database) {
    const repos = {};
    for (const f of features) {
        for (const [key, factory] of Object.entries(f.repos)) {
            if (key in repos) {
                throw new FeatureError({
                    code: FEATURE_ERROR_CODES.duplicateRepoKey,
                    message: `[feature] repo key "${key}" is contributed by more than one feature.`,
                    remediation: 'Give each feature its own repo key, or move both factories into one feature.',
                });
            }
            repos[key] = factory(database);
        }
    }
    return repos;
}
//# sourceMappingURL=index.js.map