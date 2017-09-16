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
  * All docs component into one html -  create docs/all.html file under app
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
  * redux router beta.16  move (Match component support names)
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
  *  blueprint - properties folder added

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
  * moment huge size - need alternate library
  * i18n keys find out from code - loader and plugin - pending
  * clone repo option (i18n, font) - pending
  * rollup try - pending
  * webpack3 legal - already in npm, have to check legal
  * hash changes - pending
  * babel-plugin-transform-runtime, babel-runtime,rollup, rollup-plugin-babel, rollup-plugin-node-resolve, rollup-plugin-replace, rollup-plugin-uglify, webpack3,react-addons-css-transition-group legal verification pending
