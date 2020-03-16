import * as d from '../../declarations';
import { canSkipOutputTargets } from './output-utils';
import { outputApp } from './output-app';
import { outputCollections } from './output-collection';
import { outputHydrate } from './output-hydrate';
import { outputTypes } from './output-types';
import { outputLazyLoader } from './output-lazy-loader';
import { outputWww } from './output-www';
import { outputDocs } from './output-docs';
import { outputAngular } from './output-angular';


export async function generateOutputTargets(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (canSkipOutputTargets(buildCtx)) {
    return;
  }

  await Promise.all([
    outputCollections(config, compilerCtx, buildCtx),
    outputModulesApp(config, compilerCtx, buildCtx),
    outputHydrate(config, compilerCtx, buildCtx),
    outputAngular(config, compilerCtx, buildCtx),
    outputLazyLoader(config, compilerCtx),

    buildCtx.stylesPromise
  ]);

  await outputDocs(config, compilerCtx, buildCtx),

  // must run after all the other outputs
  // since it validates files were created
  await outputTypes(config, compilerCtx, buildCtx);
}


async function outputModulesApp(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  await outputApp(config, compilerCtx, buildCtx, 'webComponentsModule');
  await outputWww(config, compilerCtx, buildCtx);
}
