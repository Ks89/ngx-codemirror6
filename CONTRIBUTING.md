Sometimes, shy developers have wonderful ideas. So don't be shy and open an issue! :)

If you want to help me, modify the source code, but **before to create a pull request, follow these steps**

# A. Cleanup and initialization
1. `npm install -g @angular/cli@latest`
2. remove all `node_modules` and temp folders with compiled files (if necessary)
3. `npm install` (from the root of this project)
4. `npm run clean:all`
5. `npm run build:lib`
6. `npm start`
7. `npm test`

# B. Create your pull request
1. **If it is ok, create your pull request specifying all the details**

<br/>
<br/>

# Only for the author @Ks89 - How to publish this on npm?

## Stable releases (@latest)
1. `cd projects/ks89/ngx-codemirror6`
2. `npm version patch` (x.x.1) or `npm version minor` (x.1.0) or `npm version major` (1.x.x)
3. `cd ../..`
4. `npm run clean:all`
5. `npm run build:lib`
6. `cd @ks89/ngx-codemirror6`
7. `npm publish`
8. `git push origin master`
9. `git push origin vx.x.x`  <-- tag name created by npm version (for instance v1.0.1)

## Beta and RC releases (@beta)
1. `cd projects/ks89/ngx-codemirror6`
2. Manually change the version of `./libs/ngx-codemirror6/package.json` with either this format `x.x.x-beta.x` or `x.x.x-rc.x` (also respect semver!)
3. `cd ../..`
4. `npm run clean:all`
5. `npm run build:lib`
6. `cd @ks89/ngx-codemirror6`
7. `npm publish --tag beta`

## Alpha releases (@next)
1. `cd projects/ks89/ngx-codemirror6`
2. Manually change the version of `./libs/ngx-codemirror6/package.json` with this format `x.x.x-alpha.x` (also respect semver!)
3. `cd ../..`
4. `npm run clean:all`
5. `npm run build:lib`
6. `cd @ks89/ngx-codemirror6`
7. `npm publish --tag next`
