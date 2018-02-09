# fz-react-cli

react-test-renderer dependencies missed - object-assign,fbjs after that we have to remove these two dependencies from package.json.
https://github.com/facebook/react/pull/8467/files

redux-router-middleware - once stable need to remove redux-router and react-router-redux library

fz-react-cli app <appname>

# 0.0.3-beta.52

* history lib updated ^3.0.0 to ^4.0.0
* screen shot report ui changes & error handling
* hmrMiddleware issue fixed

#0.0.3-beta.55

* screenShots ui issue fixed
* prod font not loading nested path issue fix

# 0.0.3-beta.56

* screenshote pull issue fixed

# 0.0.3-beta.57

* reports email send using nodemailer lib

# 0.0.3-beta.58

* reportpublish issue fixed

# 0.0.3-beta.59

* fz-react-cli global install feature
* report display unit test case report instead of code coverage

# 0.0.3-beta.60

* Screenshot report - impacted component details display
* create new app using fz-react-cli
  fz-react-cli app <appname>
  note: appname as foldername and folder should not already exist

# 0.0.3-beta.61

* dependencies resolve error fix - fz-react-cli global install

# 0.0.3-beta.62

* Screenshot report issue fix

# 0.0.3-beta.63

* docs all component temp try
* propertyToJson from fz-react-cli command line
* zoho chart global variable

# 0.0.3-beta.64

* wms for development - implement Collaboration.handleCustomMessage for handle
  message
* All docs component into one html - create docs/all.html file under app
* restricted name for app - docs and mockapi
* blueprint updated

# 0.0.3-beta.65

* production configuration --css:unique=false for portal theme build
  customization support
* unit test case - result.js code for loop to foreach
* dev log updated
* hot refresh stop - keep refresh issue

# 0.0.3-beta.66

* hot refresh issue fix
* redux router beta.16 move (Match component support names)
* unnecessary console removed
* for loop inside function move

# 0.0.3-beta.67

* fz-layout - move 1.0.0-beta.2
* react-docgen - poc for docs object generate (using docsPropsLoader)

# 0.0.3-beta.68

* react-transition-group lib added for animation while mount and unmount
* oneOf props - html issue fix
* screen shot test

# 0.0.3-beta.69

* wms connect url hard coded issue fix
* hmr connect url issue fix
* docs - babeljs move to local

# 0.0.3-beta.70

* preact
* Preact devtool hook added - https://github.com/developit/preact/pull/339
* blueprint - properties folder added

# 0.0.3-beta.71

* webpack3 move
* babel-polyfill => babel-runtime move kindly check all browser working correctly
* build library:es added - add your package json - jsnext:main,module
* fz-i18n move to es6 module system

# 0.0.3-beta.72

* babel-polyfill breakage lib fix
* redux-router-middleware, simple-normalizr, fz-i18n es6 support

# 0.0.3-beta.73

* production configuration breaking changes for polyfill fix

# 0.0.3-beta.74

* libary blueprint added
* app blueprint updated - .gitignore
* fz-react-cli library <libraryname>

# 0.0.3-beta.75

* window path issue fix
* clone repo option
* clone repo option font try

# 0.0.3-beta.76

* help page
* html app
* docs component is not link before it is clickable. that was removed
* umd issue fix

# 0.0.3-beta.77

* test config issue fix **DOCS** fix
* help server load issue fix

# 0.0.3-beta.78

* screenShots test updated for firefox and chrome

# 0.0.3-beta.79

* portal widget build configuration
* hash based build configuration
* server side rendering configuration
* monitor node server tool
* help updated
* woff2 font support added

# 0.0.3-beta.80

* moment 2.19.0 issue - https://github.com/moment/moment/issues/4228 rollback to 2.18.1

# 0.0.3-beta.81

* publish miss

# 0.0.3-beta.82

* screenShot server error fix
* js, image, font, static domain handling (staticDomain ) multiple app different static domain problem

# 0.0.3-beta.83

* chunk name instead of chunk id in the manifest json
* production css minification
* external docs
* moduleconcatenationplugin error after recompile not correctly. dev restart server something went wrong. unpredictable error
* isomorphic-style-loader@4.0.0, xmlhttprequest@1.8.0 library added for server side rendering

# 0.0.3-beta.84

* fz-layout move to 1.0.0-beta.3
* external docs html
* cluster node issue json.stringify issue fix
* webpack server config production issue fix
* production issue jsonpfunction issue fixed. two webpack app load issue. (dev, dev hot also changed)
* docs css unique check added
* html-loader for html docs try

# 0.0.3-beta.85

* docs changes
* umd library config changes
* webpack-md5-hash, isomorphic-style-loader
* babel-plugin-css-modules-transform removed unused package xmlhttprequest,html-loader,react-addons-css-transition-group,webpack3, babel-runtime,rollup,rollup-plugin-babel,rollup-plugin-node-resolve, rollup-plugin-replace,rollup-plugin-uglify,babel-plugin-transform-runtime(available in our npm registry)

# 0.0.3-beta.86

* webpack-core library missing it break hash based build generate

# 0.0.3-beta.87

* chunk name issue fixed in Chunk manifest plugin !important

# 0.0.3-beta.88

* dev server support http and https - chrome audit issue http only support

# 0.0.3-beta.89

* external docs support

# 0.0.3-beta.90

* public path variable move to vendor js avoid

# 0.0.3-beta.91

    * screen shot test move 17 compare to imagecompare and some issue fix

# 0.0.3-beta.92

    * ssl support both certificate support
    * WebpackMd5Hash root file cache makes Problem. fix to remove
    * prod, hash source map added - smap prefix file url but it is hidden in source - load manually sourcemap
    * hash - all content with 20 digit hash
    * docs - jsx parse issue outside componentPath - fixed

# 0.0.3-beta.93

* redux-router-middleware - 1.0.0-beta.18 - initial dispatch query object missing issue fix

# 0.0.3-beta.94

* widget public path config missed issue fixed
* ws auto update ^ some breaking changes fix

# 0.0.3-beta.95

* remove context in urls

# 0.0.3-beta.96

* style loader update for latest version. For style tag create under shadow dom

# 0.0.3-beta.97

* copy - flatten feature added - for third party lib folder copy

# 0.0.3-beta.98

* style-loader - style tag created under shadow dom option feature support build tool 

# 0.0.3-beta.99 pending

* clone repo option i18n pending
* webpack-md5-hash
* server side rendering
* dynamic import
* Remove proptypes in production - "babel-plugin-transform-react-remove-prop-types" not working
* moment huge size - need alternate library
* i18n keys find out from code - loader and plugin - pending
* rollup try - pending
* hash changes - pending
* cross-spawn => child_process move build in support
* fbjs remove ?
* object-assign remove ?
* nodemon, serialize-javascript - for server side rendering
* unused className find - https://github.com/webpack-contrib/purifycss-webpack#usage-with-css-modules
* unused component files list plugin - https://github.com/MatthieuLemoine/unused-webpack-plugin
* docs - import file - refer docs display like Accordion**View.docs => Accordion**View
