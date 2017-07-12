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
