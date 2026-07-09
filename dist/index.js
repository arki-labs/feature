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
/**
 * Fold the features' router fragments into one router — value AND type
 * from the single list. A mount key claimed by two features throws at
 * module load.
 */
export function composeRouter(features) {
    const merged = {};
    for (const f of features) {
        for (const [key, fragment] of Object.entries(f.router)) {
            if (key in merged) {
                throw new Error(`[feature] router mount key "${key}" is contributed by more than one feature.`);
            }
            merged[key] = fragment;
        }
    }
    return merged;
}
/** Fold the features' repo factories over one db handle. */
export function composeRepos(features, database) {
    const repos = {};
    for (const f of features) {
        for (const [key, factory] of Object.entries(f.repos)) {
            if (key in repos) {
                throw new Error(`[feature] repo key "${key}" is contributed by more than one feature.`);
            }
            repos[key] = factory(database);
        }
    }
    return repos;
}
//# sourceMappingURL=index.js.map